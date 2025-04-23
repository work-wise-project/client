import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarGlobalStyles, Dot } from './styledComponents';
import { InterviewDialog } from './InterviewDialog';
import { InterviewsSchedule } from '../../types';
import { dateFormatter } from './types';
import { getScheduledInterviews } from '../../services/interviewService';
import { useUserContext } from '../../context/UserContext';
import 'react-calendar/dist/Calendar.css';

export const CalendarComponent = () => {
    const { userContext } = useUserContext();
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

    return (
        <>
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
            />
        </>
    );
};
