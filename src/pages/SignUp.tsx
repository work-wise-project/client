import { FC, useState } from 'react';
import { Typography, Link, Box, Container, Stepper, Step, StepLabel } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import userService, { IUser } from '../services/userService';
import { AxiosError, HttpStatusCode } from 'axios';

export const SignUp: FC<{
    handleLoginSuccess: (responseLogin: { accessToken: string; refreshToken: string; user: IUser }) => void;
}> = ({ handleLoginSuccess }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const googleResponseMessage = async (credentialResponse: CredentialResponse) => {
        setErrorMessage(null);
        if (!credentialResponse?.credential) {
            setErrorMessage('Invalid Google response. Please try again.');
            return;
        }
        try {
            const { response } = await userService.googleRegister(credentialResponse);
            if (response.status === HttpStatusCode.Ok) {
                handleLoginSuccess(response.data);
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
                height: '100vh',
                alignItems: 'center',
            }}
        >
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Create account - Google sign in
                </Typography>

                <Stepper alternativeLabel activeStep={0} sx={{ justifyContent: 'center', mt: 3, mb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel></StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <GoogleLogin
                        onSuccess={googleResponseMessage}
                        onError={() => setErrorMessage('Google login failed.')}
                        theme="outline"
                        size="large"
                        shape="pill"
                    />
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
