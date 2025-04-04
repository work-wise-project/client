import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from '../../context/UserContext';
import { theme } from '../../style';
import { App } from './App';

export const Root = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <ToastContainer position="bottom-left" theme="colored" />
                    <UserProvider>
                        <App />
                    </UserProvider>
                </BrowserRouter>
            </ThemeProvider>
        </StrictMode>
    </GoogleOAuthProvider>
);
