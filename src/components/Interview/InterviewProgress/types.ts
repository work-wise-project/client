import { StepIconProps } from '@mui/material';
import { InterviewProgress } from '../../../types';

export type InterviewProgressProps = {
    interview: InterviewProgress;
};

export type CustomStepIconProps = StepIconProps & { interview: InterviewProgress; step: InterviewProgressStep };

export enum InterviewProgressStep {
    PREPARATION = 0,
    INTERVIEW_DAY = 1,
    ANALYSIS = 2,
}
