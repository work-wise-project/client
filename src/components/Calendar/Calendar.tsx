import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarGlobalStyles, Dot } from './styledComponents';
import { InterviewDialog } from './InterviewDialog';
import { InterviewsSchedule } from '../../types';
import { dateFormatter } from './types';
import { createInterview, deleteInterview, getScheduledInterviews } from '../../services/interviewService';
import { useUserContext } from '../../context/UserContext';
import 'react-calendar/dist/Calendar.css';
import { AddInterviewButton } from '../Interview/AddInterviewButton';
import { Box } from '@mui/material';
import AddInterviewModal from '../Interview/AddInterviewModal';
import { InterviewData } from '../Interview/types';

export const CalendarComponent = () => {
    const { userContext } = useUserContext();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isInterviewDialogVisible, setIsInterviewDialogVisible] = useState(false);
    const [scheduledInterviews, setScheduledInterviews] = useState<InterviewsSchedule | null>(null);

    useEffect(() => {
        const fetchScheduledInterviews = async () => {
            try {
                const interviews = userContext?.id ? await getScheduledInterviews(userContext.id) : null;
                setScheduledInterviews(interviews);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchScheduledInterviews();
    }, []);

    const handleAddInterview = async (newInterview: InterviewData) => {
        const interviewResponse = await createInterview(newInterview);
        const key = dateFormatter(new Date(newInterview.date));
        setScheduledInterviews((prev) => {
            if (prev) {
                const updatedInterviews = new Map(prev);
                if (
                    updatedInterviews.has(key) &&
                    !updatedInterviews.get(key)?.find((i) => i.id === interviewResponse.id)
                ) {
                    updatedInterviews.get(key)?.push(interviewResponse);
                } else {
                    updatedInterviews.set(key, [interviewResponse]);
                }
                return updatedInterviews;
            }
            return null;
        });
    };

    const handleDateClick = (date: Date) => {
        const key = dateFormatter(date);
        if (scheduledInterviews?.has(key)) {
            setSelectedDate(date);
            setIsInterviewDialogVisible(true);
        }
    };

    const closeInterviewDialog = () => {
        setIsInterviewDialogVisible(false);
    };

    const handleDeleteInterview = useCallback(async (interviewId: string) => {
        await deleteInterview(interviewId);

        setScheduledInterviews((prev) => {
            if (prev) {
                const updatedInterviews = new Map(prev);
                updatedInterviews.forEach((interviews, date) => {
                    const filteredInterviews = interviews.filter((interview) => interview.id !== interviewId);
                    if (filteredInterviews.length > 0) {
                        updatedInterviews.set(date, filteredInterviews);
                    } else {
                        updatedInterviews.delete(date);
                        closeInterviewDialog();
                    }
                });
                return updatedInterviews;
            }
            return null;
        });
    }, []);

    return (
        <>
            <Box sx={{ mb: 4, marginInlineStart: '10vw', mt: 5 }}>
                <AddInterviewButton onClick={() => setShowModal(true)} />
            </Box>
            <CalendarGlobalStyles />
            <Calendar
                locale="en-US"
                onClickDay={handleDateClick}
                tileContent={({ date }) => {
                    const key = dateFormatter(date);
                    return scheduledInterviews?.has(key) && <Dot />;
                }}
                tileClassName={({ date }) => (date.toDateString() === new Date().toDateString() ? 'current-day' : '')}
                value={null}
            />

            <InterviewDialog
                open={isInterviewDialogVisible}
                handleClose={closeInterviewDialog}
                selectedDate={selectedDate}
                interviews={scheduledInterviews}
                deleteInterview={handleDeleteInterview}
            />
            {showModal && <AddInterviewModal onClose={() => setShowModal(false)} onAdd={handleAddInterview} />}
        </>
    );
};
