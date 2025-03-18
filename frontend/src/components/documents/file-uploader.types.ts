import { ApplicantDetails, OccupationMatch } from '@/types';

export type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'success' | 'error';

export interface FileUploaderProps {
  setOccupations?: (occupations: OccupationMatch[]) => void;
  setLoading?: (loading: boolean) => void;
  onExtractedData?: (data: ApplicantDetails) => void;
  onUploadComplete?: (documentId: string) => void;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}