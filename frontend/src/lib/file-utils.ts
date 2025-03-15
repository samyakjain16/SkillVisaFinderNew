// src/lib/file-utils.ts
export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only PDF and DOCX are allowed.' };
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { isValid: false, error: `File size exceeds ${MAX_FILE_SIZE_MB}MB.` };
  }
  return { isValid: true };
}