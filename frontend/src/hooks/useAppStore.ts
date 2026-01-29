import { create } from 'zustand';
import { FileUploadResult, ConversionOptions, OutputFormat } from '../types';

interface AppState {
  uploadedFile: FileUploadResult | null;
  conversionOptions: ConversionOptions;
  setUploadedFile: (file: FileUploadResult | null) => void;
  updateConversionOptions: (options: Partial<ConversionOptions>) => void;
  resetOptions: () => void;
}

const defaultOptions: ConversionOptions = {
  format: 'openai',
  includeSystemPrompt: false,
  systemPrompt: '',
  removeThinkTags: true,
};

export const useAppStore = create<AppState>((set) => ({
  uploadedFile: null,
  conversionOptions: defaultOptions,
  
  setUploadedFile: (file) => set({ uploadedFile: file }),
  
  updateConversionOptions: (options) =>
    set((state) => ({
      conversionOptions: { ...state.conversionOptions, ...options },
    })),
  
  resetOptions: () =>
    set({ conversionOptions: defaultOptions, uploadedFile: null }),
}));