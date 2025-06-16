import { Box, Divider } from '@mui/material';
import { useEffect } from 'react';
import { GettingStarted } from '../components/GettingStarted';
import { InterviewForm, InterviewProgressList } from '../components/Interview';
import { useInterviewsContext } from '../context';

export const HomePage = () => {
    const { interviewsProgress, refreshInterviews } = useInterviewsContext();

    useEffect(() => {
        refreshInterviews();
    }, [refreshInterviews]);

    return (
        <Box sx={{ display: 'flex', marginTop: 2 }}>
            <Box sx={{ width: '70%' }}>
                {interviewsProgress.length === 0 ? (
                    <GettingStarted />
                ) : (
                    <InterviewProgressList interviews={interviewsProgress} />
                )}
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: '2px' }} />
            <Box sx={{ width: '30%', padding: 3 }} id="interview-form">
                <InterviewForm />
            </Box>
        </Box>
    );
};
