import { useState, useEffect } from 'react';
import { useClient } from '@/lib/context/client-context';
import { useExtractionStatus } from './useExtractionStatus';

export function useApplicantData() {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedClient } = useClient();
  const { extractionStatus } = useExtractionStatus();

  useEffect(() => {
    setIsLoading(extractionStatus === 'extracting' || 
      (!!selectedClient?.id && extractionStatus === 'completed'));
  }, [selectedClient?.id, extractionStatus]);

  return { isLoading };
}