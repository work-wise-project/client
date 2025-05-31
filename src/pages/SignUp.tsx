import { useState } from 'react';
import { Typography, Link, Box, Container, Stepper, Step, StepLabel, StepIconProps } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import userService from '../services/userService';
import { AxiosError, HttpStatusCode } from 'axios';
import ProfessionalProfile from '../components/SignUp/ProfessionalProfile';
import ResumeUpload from '../components/SignUp/ResumeUpload';
import { useUserContext } from '../context/UserContext';
import { theme } from '../style';

const CustomStepIcon: React.FC<StepIconProps> = ({ active, completed, icon }) => {
    const bgColor =
        active || completed ? (active ? theme.palette.secondary.main : theme.palette.secondary.light) : '#ccc';
    const textColor = active || completed ? '#fff' : '#000';

    return (
        <div
            style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.5rem',
            }}
        >
            {icon}
        </div>
    );
};

export const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const { setLocalStorage } = useUserContext();

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
                setLocalStorage(response.data);
                setCurrentUserId(response.data.user.id);
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
                pt: 5,
            }}
        >
            <Box sx={{ textAlign: 'center', gap: 7, display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mb: 2,
                        mt: 5,
                    }}
                >
                    <Stepper activeStep={activeStep} sx={{ width: 500 }}>
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
                        mt: 2,
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
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
                        currentUserId && (
                            <ProfessionalProfile setActiveStep={setActiveStep} currentUserId={currentUserId} />
                        )
                    ) : (
                        currentUserId && <ResumeUpload currentUserId={currentUserId} />
                    )}
                </Box>
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {errorMessage}
                    </Typography>
                )}
            </Box>
            <Box sx={{ width: '100%', textAlign: 'left', mb: 15 }}>
                <Link href="/login" variant="body1" sx={{ fontWeight: 'bold' }}>
                    Already have an account?
                </Link>
            </Box>
        </Container>
    );
};
