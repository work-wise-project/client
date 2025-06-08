import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import moment from 'moment';
import { InterviewProgress as InterviewProgressType } from '../../../types';
import { InterviewProgressProps } from './types';

/*
    TODO:
    - Fix the completion problems
    - mark steps with V and X
*/

const steps: {
    label: (interview: InterviewProgressType) => string;
    isCompleted: (interview: InterviewProgressType) => boolean;
}[] = [
    {
        label: () => 'Prepared for interview',
        isCompleted: ({ hasPreparation }) => hasPreparation,
    },
    {
        label: ({ date }) => `Interview day: ${moment(date).format('DD/MM/YYYY')}`,
        isCompleted: ({ date }) => moment.utc(date).isSameOrAfter(moment.utc(), 'day'),
    },
    {
        label: () => 'Analyzed interview',
        isCompleted: ({ hasAnalysis }) => hasAnalysis,
    },
];

const getActiveStep = (interview: InterviewProgressType) => {
    const firstIncomplete = steps.findIndex(({ isCompleted }) => !isCompleted(interview));

    return firstIncomplete === -1 ? steps.length : firstIncomplete;
};

export const InterviewProgress = ({ interview }: InterviewProgressProps) => (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingLeft: 10 }}>
        <Typography variant="h6">{interview.title}</Typography>
        <Stepper activeStep={getActiveStep(interview)} alternativeLabel sx={{ width: '95%' }}>
            {steps.map(({ label, isCompleted }, index) => (
                <Step key={index} completed={isCompleted(interview)}>
                    <StepLabel>{label(interview)}</StepLabel>
                </Step>
            ))}
        </Stepper>
    </Box>
);
