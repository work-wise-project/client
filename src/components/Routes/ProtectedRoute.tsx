import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const ProtectedRoute = () => {
    const { userContext } = useUserContext();

    return userContext?.id ? <Outlet /> : <Navigate to="/welcome" replace />;
};
