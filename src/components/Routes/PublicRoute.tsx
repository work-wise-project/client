import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const PublicRoute = ({ component }: { component: ReactNode }) => {
    const { userContext } = useUserContext();
    const location = useLocation();

    return userContext?.id && location.pathname !== '/signup' ? <Navigate to="/" replace /> : component;
};
