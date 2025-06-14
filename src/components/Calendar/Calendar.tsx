import { Event } from '@mui/icons-material';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useInterviewsContext } from '../../context';
import { InterviewForm } from '../Interview';
import { InterviewDialog } from './InterviewDialog';
import { CalendarGlobalStyles, Dot } from './styledComponents';
import { formatDate } from './types';

export const CalendarComponent = () => {
    const { scheduledInterviews } = useInterviewsContext();
    const [showAddInterviewDialog, setShowAddInterviewDialog] = useState<boolean>(false);
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
    const closeAddInterviewModal = () => {
        setShowAddInterviewDialog(false);
    };

    return (
        <>
            <Typography
                variant="h3"
                sx={{
                    textAlign: 'center',
                    fontSize: { md: '1.9rem', lg: '2rem', xl: '3rem' },
                    mt: { md: 4, lg: 4, xl: 8 },
                    color: 'secondary.main',
                }}
            >
                Scheduled Interviews
            </Typography>
            <Box sx={{ mb: 4, marginInlineStart: '10vw', mt: { lg: 5, xl: 10 } }}>
                <Button
                    sx={{ size: { md: 'small', lg: 'medium', xl: 'large' } }}
                    startIcon={<Event />}
                    onClick={() => setShowAddInterviewDialog(true)}
                    variant="contained"
                >
                    Add Interview
                </Button>
            </Box>
            <CalendarGlobalStyles />
            <Calendar
                locale="en-US"
                onClickDay={handleDateClick}
                tileContent={({ date }) => scheduledInterviews?.has(formatDate(date)) && <Dot />}
                tileClassName={({ date }) => (date.toDateString() === new Date().toDateString() ? 'current-day' : '')}
                value={null}
            />
            <InterviewDialog
                open={isInterviewDialogVisible}
                handleClose={closeInterviewDialog}
                selectedDate={selectedDate}
            />
            {showAddInterviewDialog && (
                <Dialog open onClose={closeAddInterviewModal}>
                    <Box sx={{ width: { xs: '90%', sm: 600 }, maxWidth: 600, bgcolor: 'background.paper', padding: 5 }}>
                        <InterviewForm onSubmit={closeAddInterviewModal} />
                    </Box>
                </Dialog>
            )}
        </>
    );
};
