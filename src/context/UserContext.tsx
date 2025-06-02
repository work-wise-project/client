import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../types';

type IUserContext = IUser & { isUserConnected?: boolean };

interface UserContextType {
    userContext: Partial<IUserContext> | null;
    setUserContext: React.Dispatch<React.SetStateAction<Partial<IUserContext> | null>>;
    storeUserSession: (userData: { accessToken: string; refreshToken: string; user: IUserContext }) => void;
    clearUserSession: () => void;
    setLocalStorage: (userData: { accessToken: string; refreshToken: string; user: IUserContext }) => void;
    setIsUserConnoted: (isUserConnected: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userContext, setUserContext] = useState<Partial<IUserContext> | null>(null);
    const navigate = useNavigate();

    const setLocalStorage = (userData: { accessToken: string; refreshToken: string; user: IUser }) => {
        const { user, accessToken, refreshToken } = userData;

        localStorage.setItem('userId', user.id);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const setIsUserConnoted = (isUserConnected: boolean) => {
        setUserContext((user) => ({ ...user, isUserConnected }));
    };

    const storeUserSession = (userData: { accessToken: string; refreshToken: string; user: IUser }) => {
        const { user } = userData;
        setUserContext(user);
        setLocalStorage(userData);
    };

    const clearUserSession = () => {
        setUserContext(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/welcome', { replace: true });
    };

    return (
        <UserContext.Provider
            value={{
                userContext,
                setUserContext,
                storeUserSession,
                clearUserSession,
                setLocalStorage,
                setIsUserConnoted,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
