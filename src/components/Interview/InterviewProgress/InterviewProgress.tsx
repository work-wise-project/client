import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import moment from 'moment';
import { InterviewProgress as InterviewProgressType } from '../../../types';
import { CustomStepIconProps, InterviewProgressProps, InterviewProgressStep } from './types';
import { Connector, CustomStepIcon } from './utils';

const steps: {
    step: InterviewProgressStep;
    label: (interview: InterviewProgressType) => string;
    isCompleted: (interview: InterviewProgressType) => boolean;
}[] = [
    {
        step: InterviewProgressStep.PREPARATION,
        label: () => 'Prepared for interview',
        isCompleted: ({ hasPreparation }) => hasPreparation,
    },
    {
        step: InterviewProgressStep.INTERVIEW_DAY,
        label: ({ date }) => `Interview day: ${moment(date).format('DD/MM/YYYY')}`,
        isCompleted: ({ date }) => moment().isSameOrAfter(moment(date), 'day'),
    },
    {
        step: InterviewProgressStep.ANALYSIS,
        label: () => 'Analyzed interview',
        isCompleted: ({ hasAnalysis }) => hasAnalysis,
    },
];

const getActiveStep = ({ date }: InterviewProgressType) =>
    moment().isBefore(moment(date), 'day')
        ? InterviewProgressStep.PREPARATION
        : moment().isAfter(moment(date), 'day')
        ? InterviewProgressStep.ANALYSIS
        : InterviewProgressStep.INTERVIEW_DAY;

export const InterviewProgress = ({ interview }: InterviewProgressProps) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5">{interview.title}</Typography>
        <Stepper activeStep={getActiveStep(interview)} alternativeLabel sx={{ width: '95%' }} connector={<Connector />}>
            {steps.map(({ label, isCompleted, step }, index) => (
                <Step key={index} completed={isCompleted(interview)}>
                    <StepLabel
                        slots={{ stepIcon: CustomStepIcon }}
                        slotProps={{ stepIcon: { interview, step } as CustomStepIconProps }}
                    >
                        {label(interview)}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    </Box>
);
