import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context';

export const PublicRoute = ({ component }: { component: ReactNode }) => {
    const { userContext } = useUserContext();

    return userContext?.isUserConnected ? <Navigate to="/" replace /> : component;
};
