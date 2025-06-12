import { Box, Divider, Typography } from '@mui/material';
import { InterviewForm, InterviewProgressList } from '../components/Interview';
import { useInterviewsContext } from '../context';
import { useEffect } from 'react';

export const HomePage = () => {
    const { interviewsProgress, refreshInterviews } = useInterviewsContext();

    useEffect(() => {
        refreshInterviews();
    }, [refreshInterviews]);

    return (
        <Box sx={{ display: 'flex', marginTop: 2 }}>
            <Box sx={{ width: '70%' }}>
                <Typography
                    variant="h6"
                    sx={{ textAlign: 'center', fontSize: { lg: '1.5rem', xl: '2rem' } }}
                    color="secondary"
                >
                    Your interviews progress
                </Typography>
                {interviewsProgress.length === 0 ? (
                    <Typography>No interviews</Typography>
                ) : (
                    <InterviewProgressList interviews={interviewsProgress} />
                )}
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: '2px' }} />
            <Box sx={{ width: '30%', padding: 3 }}>
                <InterviewForm />
            </Box>
        </Box>
    );
};
