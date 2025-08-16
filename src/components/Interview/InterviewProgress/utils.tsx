import { CheckCircle } from '@mui/icons-material';
import {
    IconButton,
    StepConnector,
    stepConnectorClasses,
    styled,
    SxProps,
    Theme,
    Tooltip,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CustomStepIconProps, InterviewProgressStep } from './types';

const iconButtonStyle = (theme: Theme): SxProps => ({
    padding: 0,
    '&:hover svg': { color: theme.palette.info.main, transform: 'scale(1.1)' },
    '& svg': { transition: 'color 0.2s, transform 0.2s' },
});

export const CustomStepIcon = ({
    active,
    completed,
    step,
    interview: { hasPreparation, hasAnalysis, id, title },
}: CustomStepIconProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const colors = {
        completed: theme.palette.primary.light,
        incomplete: theme.palette.secondary.main,
        active: theme.palette.grey[500],
        inactive: theme.palette.grey[300],
    };
    const stepsConfig: Record<InterviewProgressStep, { color: keyof typeof colors; route: string | null }> = {
        [InterviewProgressStep.PREPARATION]: {
            color: hasPreparation ? 'completed' : active ? 'active' : 'incomplete',
            route: 'interviewPreparation',
        },
        [InterviewProgressStep.INTERVIEW_DAY]: {
            color: active ? 'active' : !completed ? 'inactive' : 'completed',
            route: null,
        },
        [InterviewProgressStep.ANALYSIS]: {
            color: hasAnalysis ? 'completed' : active ? 'active' : 'inactive',
            route: 'interviewAnalysis',
        },
    };
    const { color, route } = stepsConfig[step];
    const Check = () => <CheckCircle sx={{ color: colors[color], fontSize: '3rem' }} />;

    return !route ? (
        <Check />
    ) : (
        <Tooltip title={`Go to ${route.replace(/([A-Z])/g, ' $1').toLowerCase()}`} arrow disableInteractive>
            <IconButton onClick={() => navigate(`/${route}/${id}`, { state: { title } })} sx={iconButtonStyle(theme)}>
                <Check />
            </IconButton>
        </Tooltip>
    );
};

export const Connector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        marginTop: 12,
        width: '80%',
        justifySelf: 'center',
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
