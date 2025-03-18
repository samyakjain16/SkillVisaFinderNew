import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, AlertCircle, RotateCw } from 'lucide-react';
import clsx from 'clsx';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/context/auth-context';
import { validateFile } from '@/lib/file-utils';
import { useClient } from '@/lib/context/client-context';
import { useExtractionStatus } from '@/hooks/useExtractionStatus';

// Define OccupationMatch type
interface OccupationMatch {
  anzsco_code: string;
  occupation_name: string;
  list?: string;
  visa_subclasses?: string;
  assessing_authority?: string;
  confidence_score: number;
  suggested_occupation: string;
}

interface FileUploaderProps {
  setOccupations?: (occupations: OccupationMatch[]) => void;
  setLoading?: (loading: boolean) => void;
}

export default function FileUploader({ setOccupations, setLoading }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { selectedClient } = useClient();

  const resetState = () => {
    setFile(null);
    setUploadStatus('idle');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = () => {
    // Always reset and open the file browser
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const { isValid, error } = validateFile(selectedFile);
      
      if (isValid) {
        setFile(selectedFile);
        setUploadStatus('idle');
        setErrorMessage(null);
      } else {
        setErrorMessage(error || 'Invalid file');
        setUploadStatus('error');
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const { isValid, error } = validateFile(droppedFile);
      
      if (isValid) {
        setFile(droppedFile);
        setUploadStatus('idle');
        setErrorMessage(null);
      } else {
        setErrorMessage(error || 'Invalid file');
        setUploadStatus('error');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('You must be logged in to upload a file.');
      setUploadStatus('error');
      return;
    }

    try {
      setIsUploading(true);
      if (setLoading) setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      api.setAuthToken(token);

      // Add client ID if a client is selected
      if (selectedClient) {
        formData.append('client_id', selectedClient.id);
      }

      const result = await api.uploadCV(formData);
      setUploadStatus('success');
      
      if (setOccupations && result.occupation_matches) {
        setOccupations(result.occupation_matches);
      }
      // Start applicant data extraction if we have a client
    if (selectedClient && result.document_id) {
      const extractionStatus = useExtractionStatus.getState();
      extractionStatus.setDocumentId(result.document_id);
      extractionStatus.setExtractionStatus('extracting');
      
      try {
        await api.request(`/documents/${result.document_id}/extract-applicant-data`);
        extractionStatus.setExtractionStatus('completed');
      } catch (error) {
        console.error('Error extracting applicant data:', error);
        extractionStatus.setExtractionStatus('failed');
      }
    }


    } catch (error: any) {
      const errorMsg = error.message || 'Upload failed. Please try again.';
      setErrorMessage(errorMsg);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      if (setLoading) setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* File Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.docx"
        onChange={handleFileChange}
      />
      
      {/* File Drop Area */}
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 min-h-[250px] flex flex-col justify-center',
          {
            'border-red-300 bg-red-50': uploadStatus === 'error',
            'border-emerald-300 bg-emerald-50': file && uploadStatus !== 'error',
            'border-gray-200 bg-gray-50 hover:border-gray-300': !file,
          }
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          // Only trigger file selection if there's no file or area is clicked (not buttons)
          if (!file) {
            handleFileSelect();
          }
        }}
        role="region"
        aria-label="File upload area"
      >
        {/* Change File Button */}
        {file && uploadStatus === 'idle' && !isUploading && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the container's click
              handleFileSelect();
            }}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-indigo-600 transition-colors shadow-sm"
            aria-label="Change file"
          >
            <RotateCw className="h-5 w-5" />
          </motion.button>
        )}
  
        {/* Icon */}
        <div className="flex flex-col items-center space-y-4">
          {!file ? (
            <Upload className="h-12 w-12 text-gray-400" />
          ) : (
            <FileText className="h-12 w-12 text-emerald-500" />
          )}
  
          {/* File Info */}
          <div className="space-y-2">
            {!file ? (
              <>
                <p className="text-gray-600 font-medium">Drop your CV here</p>
                <p className="text-sm text-gray-500">or click to browse (PDF/DOCX, max 10MB)</p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-800 text-ellipsis overflow-hidden whitespace-nowrap max-w-full">
                  {file.name}
                </p>
                <p className="text-sm text-gray-600">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            )}
          </div>
  
          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-3">
            {/* Main Button - Either "Select File" or "Analyze CV" */}
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the container's click
                if (!file || uploadStatus === 'success') {
                  handleFileSelect();
                } else {
                  handleUpload();
                }
              }}
              className={clsx(
                'w-40 h-12 px-8 py-2 rounded-xl text-white font-medium transition-colors shadow-sm flex items-center justify-center',
                isUploading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              )}
              disabled={isUploading}
              whileHover={{ scale: isUploading ? 1 : 1.02 }}
              whileTap={{ scale: isUploading ? 1 : 0.98 }}
            >
              {isUploading ? (
                <span className="flex items-center justify-center w-full">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                <span>
                  {!file || uploadStatus === 'success' ? 'Select File' : 'Analyze CV'}
                </span>
              )}
            </motion.button>
            
            {/* Secondary button to select new file if one is already selected */}
            {file && uploadStatus === 'idle' && !isUploading && (
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container's click
                  handleFileSelect();
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Choose different file
              </motion.button>
            )}
          </div>
        </div>
      </div>
  
      {/* Success Message */}
      {uploadStatus === 'success' && (
        <div className="mt-4 flex items-center justify-center text-emerald-600">
          <Check className="h-5 w-5 mr-2" />
          <span className="font-medium">Analysis Complete!</span>
        </div>
      )}
  
      {/* Error Handling */}
      {uploadStatus === 'error' && (
        <div className="mt-4 space-y-4 text-center">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{errorMessage || 'Analysis failed'}</span>
          </div>
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetState();
            }}
            className="w-40 h-12 px-8 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-colors font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </div>
      )}
  
      {/* Error Message (Generic) */}
      {errorMessage && uploadStatus !== 'error' && (
        <p className="mt-3 text-center text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}