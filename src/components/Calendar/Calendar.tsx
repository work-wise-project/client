import { useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarGlobalStyles, Dot } from './styles';
import { InterviewDialog } from './InterviewDialog';
import 'react-calendar/dist/Calendar.css';

const events: Record<string, { time: string; company: string }[]> = {
    '2025-04-23': [
        { time: '12:30', company: 'Facebook' },
        { time: '15:00', company: 'Google' },
        { time: '20:45', company: 'Amazon' },
    ],
};

export const CalendarComponent = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isInterviewDialogVisible, setIsInterviewDialogVisible] = useState(false);

    const handleDateClick = (date: Date) => {
        const key = date.toISOString().split('T')[0];
        if (events[key]) {
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
                    const key = date.toISOString().split('T')[0];
                    return events[key] ? <Dot /> : null;
                }}
                tileClassName={({ date }) => (date.toDateString() === new Date().toDateString() ? 'current-day' : '')}
                value={null}
            />

            <InterviewDialog
                open={isInterviewDialogVisible}
                handleClose={closeInterviewDialog}
                selectedDate={selectedDate}
                interviews={events}
            />
        </>
    );
};
