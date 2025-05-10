import { useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarGlobalStyles, Dot } from './styledComponents';
import { InterviewDialog } from './InterviewDialog';
import { formatDate } from './types';
import 'react-calendar/dist/Calendar.css';
import { AddInterviewButton } from '../Interview/AddInterviewButton';
import { Box } from '@mui/material';
import AddInterviewModal from '../Interview/AddInterviewModal';
import { useInterviewsContext } from '../../context/InterviewsContext';

export const CalendarComponent = () => {
    const { scheduledInterviews, addInterview, removeInterview } = useInterviewsContext();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isInterviewDialogVisible, setIsInterviewDialogVisible] = useState(false);

    const handleDateClick = (date: Date) => {
        const key = formatDate(date);
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
            <Box sx={{ mb: 4, marginInlineStart: '10vw', mt: 5 }}>
                <AddInterviewButton onClick={() => setShowModal(true)} />
            </Box>
            <CalendarGlobalStyles />
            <Calendar
                locale="en-US"
                onClickDay={handleDateClick}
                tileContent={({ date }) => {
                    const key = formatDate(date);
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
                deleteInterview={removeInterview}
            />
            {showModal && <AddInterviewModal onClose={() => setShowModal(false)} onAdd={addInterview} />}
        </>
    );
};
