import { Box, CircularProgress } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
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
                    const {
                        data: { id },
                    } = response;
                    setUserContext({ id });
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
                        <Routes>
                            <Route path="/" element={<ProtectedRoute component={<HomePage />} />} />
                            <Route
                                path="/login"
                                element={<PublicRoute component={<Login handleLoginSuccess={handleLoginSuccess} />} />}
                            />
                            <Route path="/signup" element={<PublicRoute component={<SignUp />} />} />
                            <Route path="/welcome" element={<PublicRoute component={<WelcomePage />} />} />
                            <Route path="/resume" element={<ProtectedRoute component={<ResumePage />} />} />
                            <Route path="/interviewAnalysis" element={<ProtectedRoute component={<Outlet />} />}>
                                {/* <Route index element={<InterviewChooser />} /> */}
                                <Route path=":interviewId" element={<InterviewAnalysisPage />} />
                            </Route>
                            <Route
                                path="/interviewPreparation"
                                element={<ProtectedRoute component={<InterviewPreparationPage />} />}
                            />
                        </Routes>
                    )}
                </Box>
            </NavBar>
        </>
    );
};
