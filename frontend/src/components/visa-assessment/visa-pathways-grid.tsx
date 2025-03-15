// src/components/visa-assessment/visa-pathways-grid.tsx
'use client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';  // Change this import


import { useState, useEffect } from 'react';
import { useClient } from '@/lib/context/client-context';
import { api } from '@/lib/api';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle, ArrowUpRight, Plus } from 'lucide-react';
import { visaSubclasses } from '@/data/visa-subclasses';

type VisaPathway = {
  visa_subclass: string;
  visa_name: string;
  eligibility_status: 'eligible' | 'potentially_eligible' | 'not_eligible' | 'undetermined';
  points?: number;
  assessment_id?: string;
};

export default function VisaPathwaysGrid() {
  const router = useRouter();
  const { selectedClient } = useClient();
  const [assessedPathways, setAssessedPathways] = useState<VisaPathway[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedClient) {
      fetchVisaPathways();
    }
  }, [selectedClient]);

  const fetchVisaPathways = async () => {
    if (!selectedClient) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await api.request(`/visa-assessment/client/${selectedClient.id}/summary`) as {
        visa_pathways?: VisaPathway[]
      };
      
      setAssessedPathways(data.visa_pathways || []);
    } catch (err: any) {
      console.error('Error fetching visa pathways:', err);
      setError(err.message || 'Failed to load visa pathways');
    } finally {
      setIsLoading(false);
    }
  };

  const createAssessment = async (visaSubclass: string) => {
    if (!selectedClient) return;
    
    try {
      setIsCreating(prev => ({ ...prev, [visaSubclass]: true }));
      
      await api.request('/visa-assessment/create', {
        method: 'POST',
        body: JSON.stringify({
          client_id: selectedClient.id,
          visa_subclass: visaSubclass,
        }),
      });
      
      await fetchVisaPathways();
    } catch (err: any) {
      // Log the full error object to debug
      console.log('Error details:', err.detail);
      
      if (err.detail && typeof err.detail === 'object' && err.detail.code === 'NO_CV_FOUND') {
        toast.error(
          <div className="flex flex-col">
            <span className="font-semibold">{err.detail.message}</span>
            {err.detail.action && (
              <span className="text-sm text-gray-600">{err.detail.action}</span>
            )}
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error(
          typeof err.detail === 'string' 
            ? err.detail 
            : err.detail?.message || 'Failed to create assessment',
          { duration: 5000 }
        );
      }
    } finally {
      setIsCreating(prev => ({ ...prev, [visaSubclass]: false }));
    }
  };
  
  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return (
        <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
          Not Assessed
        </div>
      );
    }
    
    switch (status) {
      case 'eligible':
        return (
          <div className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Eligible
          </div>
        );
      case 'potentially_eligible':
        return (
          <div className="flex items-center text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Potentially Eligible
          </div>
        );
      case 'not_eligible':
        return (
          <div className="flex items-center text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle className="h-3 w-3 mr-1" />
            Not Eligible
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
            Undetermined
          </div>
        );
    }
  };

  const getBorderColor = (status: string | undefined) => {
    if (!status) return 'border-gray-200';
    
    switch (status) {
      case 'eligible':
        return 'border-green-500 hover:border-green-600';
      case 'potentially_eligible':
        return 'border-yellow-500 hover:border-yellow-600';
      case 'not_eligible':
        return 'border-red-300 hover:border-red-400';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p>Error loading visa pathways: {error}</p>
        <button 
          onClick={fetchVisaPathways}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Create a merged list of all visas, with assessment data where available
  const allVisaPathways = visaSubclasses.map(visa => {
    const assessedVisa = assessedPathways.find(p => p.visa_subclass === visa.subclass);
    
    return {
      visa_subclass: visa.subclass,
      visa_name: visa.name,
      description: visa.description,
      pointsTested: visa.pointsTested,
      eligibility_status: assessedVisa?.eligibility_status,
      points: assessedVisa?.points,
      assessment_id: assessedVisa?.assessment_id
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allVisaPathways.map((pathway) => (
        <div
          key={pathway.visa_subclass}
          className={`block p-4 border-2 rounded-lg ${getBorderColor(pathway.eligibility_status)} ${!pathway.assessment_id ? 'opacity-80' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-medium">Subclass {pathway.visa_subclass}</h3>
              <p className="text-gray-600">{pathway.visa_name}</p>
            </div>
            {pathway.assessment_id && (
              <Link href={`/dashboard/assessments/${pathway.assessment_id}`}>
                <span className="text-blue-500 hover:text-blue-700">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mb-3">
            {pathway.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            {getStatusBadge(pathway.eligibility_status)}
            
            {pathway.pointsTested && pathway.points !== undefined && (
              <div className="text-sm">
                <span className="text-gray-500">Points:</span>
                <span className={`ml-1 font-medium ${pathway.points >= 65 ? 'text-green-600' : 'text-gray-700'}`}>
                  {pathway.points}
                </span>
              </div>
            )}
          </div>
          
          {!pathway.assessment_id ? (
            <button
              onClick={() => createAssessment(pathway.visa_subclass)}
              disabled={isCreating[pathway.visa_subclass]}
              className="w-full mt-2 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isCreating[pathway.visa_subclass] ? (
                <>Creating...</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Start Assessment
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/dashboard/assessments/${pathway.assessment_id}`}
              className="w-full mt-2 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Assessment
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}