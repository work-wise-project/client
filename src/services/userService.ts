import { CredentialResponse } from '@react-oauth/google';
import { apiClient } from './apiClient';
import { IUser } from '../types';

const googleLogin = async (credentialResponse: CredentialResponse) => {
    const abortController = new AbortController();
    const response = await apiClient.post('/auth/login', credentialResponse, {
        signal: abortController.signal,
    });
    return { response, abort: () => abortController.abort() };
};

const googleRegister = async (credentialResponse: CredentialResponse) => {
    const abortController = new AbortController();
    const response = await apiClient.post('/auth/register', credentialResponse, {
        signal: abortController.signal,
    });
    return { response, abort: () => abortController.abort() };
};

const refresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    const abortController = new AbortController();
    const response = await apiClient.post('/auth/refresh', { refreshToken }, { signal: abortController.signal });
    return { response, abort: () => abortController.abort() };
};

const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    const abortController = new AbortController();
    const response = await apiClient.post('/auth/logout', { refreshToken }, { signal: abortController.signal });
    return { response, abort: () => abortController.abort() };
};

const getUserById = async (userId: string) => {
    const abortController = new AbortController();

    const response = await apiClient.get(`/users/${userId}`, {
        signal: abortController.signal,
    });
    return { response, abort: () => abortController.abort() };
};

const updateUser = async (userId: string, userUpdates: Omit<IUser, 'email' | 'id' | 'name'>) => {
    const abortController = new AbortController();

    const response = await apiClient.put(`/users/${userId}`, userUpdates, {
        signal: abortController.signal,
    });
    return { response, abort: () => abortController.abort() };
};

export default {
    googleLogin,
    googleRegister,
    getUserById,
    refresh,
    logout,
    updateUser,
};
