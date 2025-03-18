import { api } from '@/lib/api';
import { validateFile } from '@/lib/file-utils';
import { FileValidationResult } from './file-uploader.types';

export const handleFileValidation = (file: File): FileValidationResult => {
  const { isValid, error } = validateFile(file);
  return { isValid, error };
};

export const handleFileUpload = async (
  file: File,
  clientId?: string,
  callbacks = {
    onStart: () => {},
    onSuccess: (data: any) => {},
    onError: (error: string) => {},
    onComplete: () => {},
  }
) => {
  const { onStart, onSuccess, onError, onComplete } = callbacks;
  
  try {
    onStart();
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);
    if (clientId) {
      formData.append('client_id', clientId);
    }

    api.setAuthToken(token);
    const result = await api.uploadCV(formData);
    onSuccess(result);
    return result;
  } catch (error: any) {
    const errorMsg = error.message || 'Upload failed. Please try again.';
    onError(errorMsg);
    throw error;
  } finally {
    onComplete();
  }
};