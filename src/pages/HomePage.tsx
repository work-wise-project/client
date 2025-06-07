import { Typography } from '@mui/material';
import { useInterviewsContext } from '../context';

export const HomePage = () => {
    const { interviewsProgress } = useInterviewsContext();

    return interviewsProgress.length === 0 ? (
        <Typography>No interviews</Typography>
    ) : (
        interviewsProgress.map((interview) => <Typography>{interview.title}</Typography>)
    );
};
