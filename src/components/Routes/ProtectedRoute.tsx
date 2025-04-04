import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const ProtectedRoute = ({ component }: { component: ReactNode }) => {
    const { userContext } = useUserContext();

    return userContext?.id ? component : <Navigate to="/welcome" replace />;
};
