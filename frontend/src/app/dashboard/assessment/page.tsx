'use client';

import VisaPathwaysGrid from '@/components/visa-assessment/visa-pathways-grid';
import ClientSelector from '@/components/clients/client-selector';
import { useClient } from '@/lib/context/client-context';
import { useAuth } from '@/lib/context/auth-context';

export default function VisaAssessmentPage() {
  const { selectedClient, isLoading: isClientLoading } = useClient();
  const { isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading || isClientLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Visa Assessment</h1>
        <div className="w-full md:w-64">
          <ClientSelector />
        </div>
      </div>
      
      {!selectedClient ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            Please select a client to view visa pathways and assessments.
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600">
            Select a visa pathway to view detailed eligibility assessment.
          </p>
          <VisaPathwaysGrid />
        </>
      )}
    </div>
  );
}