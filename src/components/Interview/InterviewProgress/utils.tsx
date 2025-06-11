import { CheckCircle } from '@mui/icons-material';
import { StepConnector, stepConnectorClasses, styled, useTheme } from '@mui/material';
import { CustomStepIconProps, InterviewProgressStep } from './types';

export const CustomStepIcon = ({
    active,
    completed,
    step,
    interview: { hasPreparation, hasAnalysis },
}: CustomStepIconProps) => {
    const theme = useTheme();

    const colors = {
        completed: theme.palette.primary.main,
        incomplete: theme.palette.secondary.main,
        active: theme.palette.grey[600],
        inactive: theme.palette.grey[400],
    };
    const steps: Record<InterviewProgressStep, keyof typeof colors> = {
        [InterviewProgressStep.UNDEFINED]: 'inactive',
        [InterviewProgressStep.PREPARATION]: hasPreparation ? 'completed' : active ? 'active' : 'incomplete',
        [InterviewProgressStep.INTERVIEW_DAY]: active ? 'active' : !completed ? 'inactive' : 'completed',
        [InterviewProgressStep.ANALYSIS]: hasAnalysis ? 'completed' : active ? 'active' : 'inactive',
    };

    return <CheckCircle sx={{ color: colors[steps[step]] }} fontSize="large" />;
};

export const Connector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        marginTop: 4,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
}));
