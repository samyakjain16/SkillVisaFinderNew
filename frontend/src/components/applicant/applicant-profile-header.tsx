import { useApplicantData } from '@/hooks/useApplicantData';

export function ApplicantProfileHeader() {
  const { isLoading } = useApplicantData();

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-medium">Applicant Profile</h2>
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
      )}
    </div>
  );
}