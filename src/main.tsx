import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';
import theme from './theme';
import { UserProvider } from './context/UserContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
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
  </GoogleOAuthProvider>,
);
