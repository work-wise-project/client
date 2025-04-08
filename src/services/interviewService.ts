import { Transcript } from '../types';
import { apiClient } from './apiClient';

export const analyzeInterview = async (file: File, fileType: 'audio' | 'text') => {
    const { abort, signal } = new AbortController();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const {
        data: { transcript },
    } = await apiClient.post<{ transcript: Transcript }>('/interviews/analysis', formData, {
        signal,
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return { transcript, abort };
};
