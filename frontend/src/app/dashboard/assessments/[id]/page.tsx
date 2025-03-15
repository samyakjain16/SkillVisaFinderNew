// src/app/dashboard/assessments/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AssessmentHeader from '../../../../components/visa-assessment/assessment-header';
import PointsSummary from '../../../../components/visa-assessment/points_summary';
import AssessmentForm from '../../../../components/visa-assessment/assessment_form';
import LoadingSpinner from '../../../../components/ui/loader-spinner';

// Define the Assessment type
interface Assessment {
  id: string;
  visa_subclass: string;
  visa_name: string;
  eligibility_status: string;
  total_points?: number;
  age_value?: number;
  age_points?: number;
  english_level?: string;
  english_test?: string;
  english_points?: number;
  education_level?: string;
  education_field?: string;
  education_points?: number;
  experience_overseas_years?: number;
  experience_australia_years?: number;
  experience_points?: number;
  australian_study?: boolean;
  australian_study_points?: number;
  specialist_education?: boolean;
  specialist_education_points?: number;
  partner_skills_points?: number;
  community_language_points?: number;
  regional_study_points?: number;
  professional_year_points?: number;
  eligibility_notes?: string;
}

// Define FormData type for updates
interface FormData {
  age_value?: number;
  english_level?: string;
  english_test?: string;
  education_level?: string;
  education_field?: string;
  experience_overseas_years?: number;
  experience_australia_years?: number;
  australian_study?: boolean;
  specialist_education?: boolean;
  partner_skills_points?: number;
  community_language_points?: number;
  regional_study_points?: number;
  professional_year_points?: number;
}

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.request(`/visa-assessment/${id}`) as Assessment;
      setAssessment(data);
    } catch (err: any) {
      console.error('Error fetching assessment:', err);
      setError(err.message || 'Failed to load assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      setIsSaving(true);
      await api.request(`/visa-assessment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      // Fetch updated assessment data after save
      await fetchAssessment();
    } catch (err: any) {
      console.error('Error saving assessment:', err);
      setError(err.message || 'Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading assessment..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-medium">Error: {error}</p>
        <button 
          onClick={fetchAssessment}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!assessment) {
    return <div>Assessment not found</div>;
  }

  return (
    <div className="space-y-6">
      <AssessmentHeader assessment={assessment} />
      <PointsSummary assessment={assessment} />
      <AssessmentForm 
        assessment={assessment} 
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}