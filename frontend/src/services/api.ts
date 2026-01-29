import axios from 'axios';
import {
  ConversionOptions,
  FileUploadResult,
  ConversionResult,
  FileStats,
  PreviewData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  uploadFile: async (file: File): Promise<FileUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<FileUploadResult>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  convertData: async (
    fileId: string,
    options: ConversionOptions
  ): Promise<ConversionResult> => {
    const response = await api.post<ConversionResult>('/convert', {
      fileId,
      options,
    });

    return response.data;
  },

  getStats: async (fileId: string): Promise<FileStats> => {
    const response = await api.get<FileStats>(`/stats/${fileId}`);
    return response.data;
  },

  getPreview: async (fileId: string, limit = 5): Promise<PreviewData> => {
    const response = await api.get<PreviewData>(`/preview/${fileId}`, {
      params: { limit },
    });
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/file/${fileId}`);
  },
};