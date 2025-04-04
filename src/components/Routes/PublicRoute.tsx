import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const PublicRoute = ({ component }: { component: ReactNode }) => {
    const { userContext } = useUserContext();

    return userContext?.id ? <Navigate to="/" replace /> : component;
};
