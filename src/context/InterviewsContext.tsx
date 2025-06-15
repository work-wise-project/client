import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { formatDate } from '../components/Calendar/types';
import {
    createInterview,
    deleteInterview,
    getInterviewsByUser,
    getScheduledInterviews,
} from '../services/interviewService';
import { InterviewData, InterviewProgress, InterviewsSchedule } from '../types';
import { useUserContext } from './UserContext';

type InterviewsContextType = {
    scheduledInterviews: InterviewsSchedule | null;
    interviewsProgress: InterviewProgress[];
    addInterview: (newInterview: InterviewData) => Promise<void>;
    removeInterview: (interviewId: string) => Promise<void>;
    refreshInterviews: () => Promise<void>;
};

const InterviewsContext = createContext<InterviewsContextType | undefined>(undefined);

export const InterviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userContext } = useUserContext();
    const [scheduledInterviews, setScheduledInterviews] = useState<InterviewsSchedule | null>(null);
    const [interviewsProgress, setInterviewsProgress] = useState<InterviewProgress[]>([]);

    const refreshInterviews = useCallback(async () => {
        try {
            if (!userContext?.id) {
                setScheduledInterviews(null);
                setInterviewsProgress([]);
                return;
            }

            setScheduledInterviews(await getScheduledInterviews(userContext.id));
            setInterviewsProgress(await getInterviewsByUser(userContext.id));
        } catch (error) {
            console.error('Error fetching scheduled interviews:', error);
        }
    }, [userContext?.id]);

    useEffect(() => {
        refreshInterviews();
    }, [refreshInterviews]);

    const addInterview = async (newInterview: InterviewData) => {
        const interviewResponse = await createInterview(newInterview);
        const key = formatDate(new Date(newInterview.date));
        setScheduledInterviews((prev) => {
            if (prev) {
                const updated = new Map(prev);
                if (updated.has(key)) {
                    updated.get(key)?.push(interviewResponse);
                } else {
                    updated.set(key, [interviewResponse]);
                }
                return updated;
            }
            return new Map([[key, [interviewResponse]]]);
        });
        setInterviewsProgress((prev) => [...prev, { ...interviewResponse, hasAnalysis: false, hasPreparation: false }]);
    };

    const removeInterview = async (interviewId: string) => {
        await deleteInterview(interviewId);
        setScheduledInterviews((prev) => {
            if (prev) {
                const updated = new Map(prev);
                updated.forEach((interviews, date) => {
                    const filtered = interviews.filter((i) => i.id !== interviewId);
                    if (filtered.length > 0) {
                        updated.set(date, filtered);
                    } else {
                        updated.delete(date);
                    }
                });
                return updated;
            }
            return null;
        });
        setInterviewsProgress((prev) => prev.filter((interview) => interview.id !== interviewId));
    };

    return (
        <InterviewsContext.Provider
            value={{ interviewsProgress, scheduledInterviews, addInterview, removeInterview, refreshInterviews }}
        >
            {children}
        </InterviewsContext.Provider>
    );
};

export const useInterviewsContext = () => {
    const context = useContext(InterviewsContext);
    if (!context) throw new Error('useInterviewsContext must be used within an InterviewsProvider');
    return context;
};
