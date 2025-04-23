import { InterviewAnalysis, InterviewsSchedule } from '../types';
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

export const getScheduledInterviews = async (userId: string): Promise<InterviewsSchedule> => {
    // const { data } = await apiClient.get(
    //     `/interviews/${userId}`,
    // );

    const events: InterviewsSchedule = new Map([
        [
            '2025-04-23',
            [
                { id: '123', time: '12:30', company: 'Facebook' },
                { id: '1234', time: '15:00', company: 'Google' },
                { id: '1235', time: '20:45', company: 'Amazon' },
            ],
        ],
        [
            '2025-04-27',
            [
                { id: '123', time: '12:30', company: 'Facebook' },
                { id: '1234', time: '15:00', company: 'Google' },
                { id: '1235', time: '20:45', company: 'Amazon' },
            ],
        ],
    ]);

    return events;
};
