import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useInterviewsContext } from '../../context';
import { theme } from '../../style';
import { AddInterviewButton } from '../Interview/AddInterviewButton';
import { AddInterviewModal } from '../Interview/AddInterviewModal';
import { InterviewDialog } from './InterviewDialog';
import { CalendarGlobalStyles, Dot } from './styledComponents';
import { formatDate } from './types';

export const CalendarComponent = () => {
    const { scheduledInterviews } = useInterviewsContext();
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
            <Typography
                variant="h3"
                sx={{
                    textAlign: 'center',
                    fontSize: { lg: '2rem', xl: '3rem' },
                    color: theme.palette.secondary.main,
                }}
            >
                Scheduled Interviews
            </Typography>
            <Box sx={{ mb: 4, marginInlineStart: '10vw', mt: { lg: 5, xl: 10 } }}>
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
            />
            {showModal && <AddInterviewModal onClose={() => setShowModal(false)} />}
        </>
    );
};
