import { Box, Divider, Typography } from '@mui/material';
import { useInterviewsContext } from '../context';
import { InterviewForm } from '../components/Interview';
import { InterviewProgress } from '../components/Interview/InterviewProgress';

export const HomePage = () => {
    const { interviewsProgress } = useInterviewsContext();

    return (
        <Box sx={{ display: 'flex', marginTop: 2 }}>
            <Box
                sx={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 3,
                    gap: 5,
                }}
            >
                {interviewsProgress.length === 0 ? (
                    <Typography>No interviews</Typography>
                ) : (
                    interviewsProgress
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((interview) => <InterviewProgress key={interview.id} interview={interview} />)
                )}
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: '2px' }} />
            <Box sx={{ width: '30%', padding: 3 }}>
                <InterviewForm />
            </Box>
        </Box>
    );
};
