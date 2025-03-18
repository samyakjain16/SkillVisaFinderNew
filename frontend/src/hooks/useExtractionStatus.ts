// src/hooks/useExtractionStatus.ts
import { create } from 'zustand';

type ExtractionStatus = 'idle' | 'extracting' | 'completed' | 'failed';

interface ExtractionState {
  extractionStatus: ExtractionStatus;
  documentId: string | null;
  setExtractionStatus: (status: ExtractionStatus) => void;
  setDocumentId: (id: string | null) => void;
  resetExtraction: () => void;
}

export const useExtractionStatus = create<ExtractionState>((set) => ({
  extractionStatus: 'idle',
  documentId: null,
  setExtractionStatus: (status) => set({ extractionStatus: status }),
  setDocumentId: (id) => set({ documentId: id }),
  resetExtraction: () => set({ extractionStatus: 'idle', documentId: null }),
}));