import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { HttpStatusCode } from 'axios';
import { Box, CircularProgress, Container, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import userService, { IUser } from './services/userService';
import { useUserContext } from './context/UserContext';
import WelcomePage from './pages/WelcomePage';

const App = () => {
  const { userContext, setUserContext, storeUserSession } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleLoginSuccess = (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => {
    storeUserSession(userData);
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = localStorage.getItem('userId');

      if (!storedUserId) {
        setUserContext(null);
        setIsLoading(false);

        return;
      }

      try {
        const { response } = await userService.getUserById(storedUserId);

        if (response.status === HttpStatusCode.Ok) {
          const {
            data: { _id },
          } = response;
          setUserContext({ _id });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={
                userContext?._id ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/"
              element={
                userContext?._id ? (
                  <div>home </div>
                ) : (
                  <Navigate to="/welcome" replace />
                )
              }
            />
            <Route
              path="/welcome"
              element={
                userContext?._id ? <Navigate to="/" replace /> : <WelcomePage />
              }
            />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default App;
