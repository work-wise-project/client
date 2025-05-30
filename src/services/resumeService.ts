import { apiClient } from './apiClient';

export interface IResumeAnalysisResult {
    general_review: string;
    strengths: string[];
    weaknesses: string[];
}
const getResumeIfExist = async (userId: string) => {
    const abortController = new AbortController();

    const response = await apiClient.get(`/resume/${userId}`, {
        signal: abortController.signal,
    });

    return { response, abort: () => abortController.abort() };
};

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

const analyzeResume = async (userId: string) => {
    const abortController = new AbortController();
    const responseResume = await apiClient.post(`/resume/analyze-resume/${userId}`);
    return { responseResume, abort: () => abortController.abort() };
};

const checkResumeGrammar = async (userId: string) => {
    const abortController = new AbortController();
    const responseCheckGrammar = await apiClient.post(`/resume/check-grammar/${userId}`);
    return { responseCheckGrammar, abort: () => abortController.abort() };
};

export default {
    uploadResume,
    analyzeResume,
    checkResumeGrammar,
    getResumeIfExist,
};
