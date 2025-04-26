import { apiClient } from './apiClient';

export interface IResumeAnalysisResult {
    general_review: string;
    strengths: string[];
    weaknesses: string[];
}

const uploadResume = async (userId: string, formData: FormData) => {
    const abortController = new AbortController();

    const response = await apiClient.post(`/resume/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        signal: abortController.signal,
    });

    return { response, abort: () => abortController.abort() };
};

const analyzeResume = async (fileUrl: string) => {
    const abortController = new AbortController();
    const responseResume = await apiClient.post('/resume/analyze-resume', { fileUrl });
    return { responseResume, abort: () => abortController.abort() };
};

const checkResumeGrammar = async (fileUrl: string) => {
    const abortController = new AbortController();
    const responseCheckGrammar = await apiClient.post('/resume/check-grammar', { fileUrl });
    return { responseCheckGrammar, abort: () => abortController.abort() };
};

export default {
    uploadResume,
    analyzeResume,
    checkResumeGrammar,
};
