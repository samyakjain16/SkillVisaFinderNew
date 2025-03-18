import { Upload, FileText, Check, AlertCircle, RotateCw } from 'lucide-react';
import { UploadStatus } from './file-uploader.types';

export const renderUploadStatus = (
  status: UploadStatus,
  file: File | null
) => {
  switch (status) {
    case 'uploading':
      return (
        <div className="flex items-center justify-center gap-2">
          <RotateCw className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm text-gray-600">Uploading CV...</span>
        </div>
      );
    
    case 'extracting':
      return (
        <div className="flex items-center justify-center gap-2">
          <RotateCw className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm text-gray-600">Extracting data...</span>
        </div>
      );
    
    case 'success':
      return (
        <div className="flex items-center justify-center gap-2 text-green-600">
          <Check className="h-5 w-5" />
          <span className="text-sm">Upload complete</span>
        </div>
      );
    
    case 'error':
      return (
        <div className="flex items-center justify-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Upload failed</span>
        </div>
      );
    
    default:
      return file ? (
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drop your CV here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF and DOCX (max 10MB)
          </p>
        </div>
      );
  }
};