// src/components/visa-assessment/assessment-header.tsx
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Link from 'next/link';



// Define type for the assessment prop
interface Assessment {
    id: string;
    visa_subclass: string;
    visa_name: string;
    eligibility_status: 'eligible' | 'potentially_eligible' | 'not_eligible' | 'undetermined' | string;
  }

export default function AssessmentHeader({ assessment }: { assessment: Assessment }) {
  const getStatusBadge = () => {
    switch (assessment.eligibility_status) {
      case 'eligible':
        return (
          <div className="flex items-center text-sm font-medium text-green-800 bg-green-100 px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Eligible
          </div>
        );
      case 'potentially_eligible':
        return (
          <div className="flex items-center text-sm font-medium text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            Potentially Eligible
          </div>
        );
      case 'not_eligible':
        return (
          <div className="flex items-center text-sm font-medium text-red-800 bg-red-100 px-3 py-1 rounded-full">
            <XCircle className="h-4 w-4 mr-1.5" />
            Not Eligible
          </div>
        );
      default:
        return (
          <div className="flex items-center text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
            Undetermined
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {assessment.visa_subclass} {assessment.visa_name}
          </h1>
          <div className="text-gray-500">
            Assessment ID: {assessment.id.substring(0, 8)}...
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <Link
            href="/dashboard/assessment"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    </div>
  );
}