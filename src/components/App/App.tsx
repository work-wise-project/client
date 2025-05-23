import { Box, CircularProgress } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import {
    HomePage,
    InterviewAnalysisPage,
    InterviewPreparationPage,
    Login,
    ResumePage,
    SignUp,
    WelcomePage,
} from '../../pages';
import userService from '../../services/userService';
import { NavBar } from '../NavBar';
import { ProtectedRoute, PublicRoute } from '../Routes';
import { IUser } from '../../types';
import { InterviewsProvider } from '../../context/InterviewsContext';
import InterviewChooser from '../Interview/InterviewChooser';
import { ProfilePage } from '../../pages/ProfilePage';

export const App = () => {
    const { setUserContext, storeUserSession } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const handleLoginSuccess = (userData: { accessToken: string; refreshToken: string; user: IUser }) => {
        storeUserSession(userData);
        navigate('/');
    };

    useEffect(() => {
        (async () => {
            const storedUserId = localStorage.getItem('userId');

            if (!storedUserId) {
                setUserContext(null);
                setIsLoading(false);

                return;
            }

            try {
                const { response } = await userService.getUserById(storedUserId);

                if (response.status === HttpStatusCode.Ok) {
                    const { data: user } = response;
                    setUserContext(user);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <NavBar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <InterviewsProvider>
                            <Routes>
                                <Route
                                    path="/login"
                                    element={
                                        <PublicRoute component={<Login handleLoginSuccess={handleLoginSuccess} />} />
                                    }
                                />
                                <Route path="/signup" element={<PublicRoute component={<SignUp />} />} />
                                <Route path="/welcome" element={<PublicRoute component={<WelcomePage />} />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/resume" element={<ResumePage />} />
                                    <Route path="/interviewAnalysis" element={<InterviewChooser />} />
                                    <Route path="/interviewAnalysis/:interviewId" element={<InterviewAnalysisPage />} />
                                    <Route path="/interviewPreparation" element={<InterviewPreparationPage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Route>
                            </Routes>
                        </InterviewsProvider>
                    )}
                </Box>
            </NavBar>
        </>
    );
};
