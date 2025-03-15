'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import AuthGuard from '@/app/auth/auth-guard';
import { useClient } from '@/lib/context/client-context';
import { api } from '@/lib/api';

// Define the occupation type
interface OccupationMatch {
  anzsco_code: string;
  occupation_name: string;
  list?: string;
  visa_subclasses?: string;
  assessing_authority?: string;
  confidence_score: number;
  suggested_occupation: string;
}



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [occupations, setOccupations] = useState<OccupationMatch[]>([]);
  const [loadingOccupations, setLoadingOccupations] = useState(false);
  const { selectedClient } = useClient();

  useEffect(() => {
    // Clear occupations when selected client changes
    setOccupations([]);

    async function fetchOccupations() {
      if (!selectedClient) {
        setOccupations([]);
        return;
      }      
      try {
        setLoadingOccupations(true);
        const response = await api.request<{ document: any; occupation_matches: OccupationMatch[] }>(`/documents/client/${selectedClient.id}/latest`);
        if (response?.occupation_matches) {
          setOccupations(response.occupation_matches);
        } else {
          setOccupations([]);
        }
      } catch (error) {
        console.error('Error fetching occupations:', error);
        setOccupations([]);
      } finally {
        setLoadingOccupations(false);
      }
    }

    fetchOccupations();
  }, [selectedClient]);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50/95">
        {/* Sidebar Component */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          occupations={occupations}
          setOccupations={setOccupations}
          loadingOccupations={loadingOccupations}
          setLoadingOccupations={setLoadingOccupations}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Component */}
          <Header setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
