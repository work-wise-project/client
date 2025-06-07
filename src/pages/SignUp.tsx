import { Box, Container, Link, Step, StepIconProps, StepLabel, Stepper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { AxiosError, HttpStatusCode } from 'axios';
import { useState } from 'react';
import ProfessionalProfile from '../components/SignUp/ProfessionalProfile';
import ResumeUpload from '../components/SignUp/ResumeUpload';
import { useUserContext } from '../context';
import userService from '../services/userService';

const StepIconContainer = styled('div')(
    ({ theme, active, completed }: { theme: any; active: boolean; completed: boolean }) => ({
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor:
            active || completed ? (active ? theme.palette.secondary.main : theme.palette.secondary.light) : '#ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active || completed ? '#fff' : '#000',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        [theme.breakpoints.up('lg')]: {
            width: 50,
            height: 50,
            fontSize: '1.75rem',
        },
        [theme.breakpoints.up('xl')]: {
            width: 60,
            height: 60,
            fontSize: '2rem',
        },
    })
);

const CustomStepIcon: React.FC<StepIconProps> = ({ active, completed, icon }) => {
    return (
        <StepIconContainer active={active || false} completed={completed || false} theme={undefined}>
            {icon}
        </StepIconContainer>
    );
};

export const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { storeUserSession } = useUserContext();

    const [activeStep, setActiveStep] = useState<number>(0);
    const googleResponseMessage = async (credentialResponse: CredentialResponse) => {
        setErrorMessage(null);
        if (!credentialResponse?.credential) {
            setErrorMessage('Invalid Google response. Please try again.');
            return;
        }
        try {
            const { response } = await userService.googleRegister(credentialResponse);
            if (response.status === HttpStatusCode.Ok) {
                storeUserSession(response.data);
                setActiveStep((prev) => prev + 1);
                setErrorMessage(null);
            } else {
                setErrorMessage('Google login failed. Please try again.');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data.message;
                setErrorMessage(
                    (typeof errorMessage === 'string' && errorMessage) || 'An error occurred. Please try again.'
                );
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        }
    };

    const steps = ['1', '2', '3'];

    const getStepTitle = () =>
        activeStep === 0
            ? 'Create account - Google sign in'
            : activeStep === 1
            ? 'Create account - Professional profile'
            : 'Create account - Resume upload (optional)';

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'calc(100vh - var(--toolbar-height))',
                alignItems: 'center',
                pt: { lg: 2, xl: 5 },
            }}
        >
            <Box sx={{ textAlign: 'center', gap: { lg: 2, xl: 7 }, display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mb: 2,
                        mt: 5,
                    }}
                >
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            width: { xs: 300, sm: 400, md: 500, lg: 600, xl: 700 },
                            '& .MuiStepConnector-line': {
                                borderTopWidth: { xs: 1, lg: 2, xl: 3 },
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={CustomStepIcon} />
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                        flexDirection: 'column',
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', lg: '2rem', xl: '3rem' } }}
                    >
                        {getStepTitle()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    {activeStep === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                width: 220,
                            }}
                        >
                            <GoogleLogin
                                onSuccess={googleResponseMessage}
                                onError={() => setErrorMessage('Google login failed.')}
                                theme="outline"
                                size="large"
                                shape="pill"
                            />
                        </Box>
                    ) : activeStep === 1 ? (
                        <ProfessionalProfile setActiveStep={setActiveStep} />
                    ) : (
                        <ResumeUpload />
                    )}
                </Box>
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {errorMessage}
                    </Typography>
                )}
            </Box>
            <Box sx={{ width: '100%', textAlign: 'left', mb: { lg: 5, xl: 15 } }}>
                <Link href="/login" variant="body1" sx={{ fontWeight: 'bold' }}>
                    Already have an account?
                </Link>
            </Box>
        </Container>
    );
};
