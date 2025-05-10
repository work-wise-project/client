import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { InterviewsSchedule } from '../types';
import { createInterview, deleteInterview, getScheduledInterviews } from '../services/interviewService';
import { useUserContext } from './UserContext';
import { InterviewData } from '../components/Interview/types';
import { formatDate } from '../components/Calendar/types';

type InterviewsContextType = {
    scheduledInterviews: InterviewsSchedule | null;
    addInterview: (newInterview: InterviewData) => Promise<void>;
    removeInterview: (interviewId: string) => Promise<void>;
    refreshInterviews: () => Promise<void>;
};

const InterviewsContext = createContext<InterviewsContextType | undefined>(undefined);

export const InterviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userContext } = useUserContext();
    const [scheduledInterviews, setScheduledInterviews] = useState<InterviewsSchedule | null>(null);

    const refreshInterviews = useCallback(async () => {
        try {
            const interviews = userContext?.id ? await getScheduledInterviews(userContext.id) : null;
            setScheduledInterviews(interviews);
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
    };

    return (
        <InterviewsContext.Provider value={{ scheduledInterviews, addInterview, removeInterview, refreshInterviews }}>
            {children}
        </InterviewsContext.Provider>
    );
};

export const useInterviewsContext = () => {
    const context = useContext(InterviewsContext);
    if (!context) throw new Error('useInterviewsContext must be used within an InterviewsProvider');
    return context;
};
