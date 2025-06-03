import { FC, useState } from 'react';
import { Typography, Link, Box, Container } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import userService from '../services/userService';
import { AxiosError, HttpStatusCode } from 'axios';
import { IUser } from '../types';

export const Login: FC<{
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
            const { response } = await userService.googleLogin(credentialResponse);
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

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'calc(100vh - var(--toolbar-height))',
                alignItems: 'center',
            }}
        >
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Log In
                </Typography>
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
                <Link href="/signup" variant="body1" sx={{ fontWeight: 'bold' }}>
                    Don’t have an account?
                </Link>
            </Box>
        </Container>
    );
};
