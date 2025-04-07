import { FC, useState } from 'react';
import { Typography, Link, Box, Container, Stepper, Step, StepLabel, StepIconProps, styled } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import userService, { IUser } from '../services/userService';
import { AxiosError, HttpStatusCode } from 'axios';
import ProfessionalProfile from '../components/SignUp/ProfessionalProfile';

const CustomStepIcon: React.FC<StepIconProps> = ({ active, completed, icon }) => {
    const bgColor = active || completed ? '#1976d2' : '#ccc'; // Blue if active/completed
    const textColor = active || completed ? '#fff' : '#000'; // White number or black if inactive

    return (
        <div
            style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.3rem',
            }}
        >
            {icon}
        </div>
    );
};

export const SignUp: FC<{
    handleLoginSuccess: (responseLogin: { accessToken: string; refreshToken: string; user: IUser }) => void;
}> = ({ handleLoginSuccess }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
                // handleLoginSuccess(response.data);
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

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '85vh',
                alignItems: 'center',
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        mb: 2,
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
                    {activeStep === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                                Create account - Google sign in
                            </Typography>
                            <Box sx={{ width: 220, mt: 5 }}>
                                <GoogleLogin
                                    onSuccess={googleResponseMessage}
                                    onError={() => setErrorMessage('Google login failed.')}
                                    theme="outline"
                                    size="large"
                                    shape="pill"
                                />
                            </Box>
                        </Box>
                    ) : (
                        activeStep === 1 && <ProfessionalProfile />
                    )}
                </Box>
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {errorMessage}
                    </Typography>
                )}
            </Box>
            <Box sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
                <Link href="/login" variant="body1" sx={{ fontWeight: 'bold' }}>
                    Already have an account?
                </Link>
            </Box>
        </Container>
    );
};
