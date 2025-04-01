import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../services/userService';

interface User {
  id: string;
}

interface UserContextType {
  userContext: User | null;
  setUserContext: (user: User | null) => void;
  storeUserSession: (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => void;
  clearUserSession: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userContext, setUserContext] = useState<User | null>(null);
  const navigate = useNavigate();

  const storeUserSession = (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => {
    const { user, accessToken, refreshToken } = userData;
    setUserContext({
      id: user.id,
    });
    localStorage.setItem('userId', user.id);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const clearUserSession = () => {
    setUserContext(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  return (
    <UserContext.Provider
      value={{
        userContext,
        setUserContext,
        storeUserSession,
        clearUserSession,
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
