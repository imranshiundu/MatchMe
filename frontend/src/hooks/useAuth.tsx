import { useState, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

type JwtPayload = {
    userId: number;
    exp: number;
};

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
    const [userId, setUserId] = useState<number | null>(null);

    const setAuthToken = useCallback((newToken: string | null) => {
        if (newToken) {
            const decoded = jwtDecode<JwtPayload>(newToken);
            sessionStorage.setItem('token', newToken);
            sessionStorage.setItem('id', String(decoded.userId));
            setUserId(decoded.userId);
        } else {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id');
            setUserId(null);
        }
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        setAuthToken(null);
    }, [setAuthToken]);

    const isAuthenticated: boolean = !!token && (jwtDecode<JwtPayload>(token).exp > (Date.now()/1000));

    return {
        token,
        userId,
        setAuthToken,
        logout,
        isAuthenticated
    };
}