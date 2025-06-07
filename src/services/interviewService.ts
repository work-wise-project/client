import { InterviewData } from '../components/Interview/types';
import { Interview, InterviewAnalysis, InterviewAudioFile, InterviewProgress, InterviewsSchedule } from '../types';
import { apiClient } from './apiClient';

export const analyzeInterview = async (interviewId: string, file: File, fileType: 'audio' | 'text') => {
    const { abort, signal } = new AbortController();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const {
        data: { analysis },
    } = await apiClient.post<{ analysis: InterviewAnalysis }>(`/interviews/analysis/${interviewId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
    });

    return { analysis, abort };
};

export const getInterviewAnalysis = async (interviewId: string) => {
    const { abort, signal } = new AbortController();

    const {
        data: { analysis, file },
    } = await apiClient.get<{ analysis: InterviewAnalysis; file: InterviewAudioFile }>(
        `/interviews/analysis/${interviewId}`,
        { signal }
    );

    return { analysis, file, abort };
};

export const getInterviewPreparation = async (interviewId: string) => {
    const { abort, signal } = new AbortController();

    const {
        data: { interview_id, company_info, job_info, material_links },
    } = await apiClient.get<{
        interview_id: string;
        company_info: string;
        job_info: string;
        material_links: { title: string; description: string; link: string }[];
    }>(`/interviews/preparation/${interviewId}`, { signal });

    return { interview_id, company_info, job_info, material_links, abort };
};

export const createInterview = async (interview: InterviewData): Promise<Interview> => {
    const { data } = await apiClient.post('/datamanager/proxy/interviews', interview);

    return data;
};

export const getScheduledInterviews = async (userId: string): Promise<InterviewsSchedule> => {
    const { data } = await apiClient.get(`datamanager/proxy/interviews/${userId}/schedule`);

    return new Map(Object.entries(data));
};

export const deleteInterview = async (interviewId: string) => {
    await apiClient.delete(`/datamanager/proxy/interviews/${interviewId}`);
};

export const getInterviewsByUser = async (userId: string): Promise<InterviewProgress[]> =>
    (await apiClient.get(`/datamanager/proxy/interviews/${userId}`)).data;
