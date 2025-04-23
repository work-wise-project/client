import { InterviewAnalysis } from '../types';
import { apiClient } from './apiClient';

export const analyzeInterview = async (file: File, fileType: 'audio' | 'text') => {
    const { abort, signal } = new AbortController();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const {
        data: { analysis },
    } = await apiClient.post<{ analysis: InterviewAnalysis }>('/interviews/analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
    });

    return { analysis, abort };
};
