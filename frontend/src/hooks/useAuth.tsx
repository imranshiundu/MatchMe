import { useState, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

type JwtPayload = {
    userId: number;
    exp: number;
};

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
    const [userId, setUserId] = useState<number | null>(Number(sessionStorage.getItem('id')));

    const setAuthToken = useCallback((newToken: string | null) => {
        if (!newToken) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id');
            setToken(null);
            setUserId(null);
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(newToken);
            sessionStorage.setItem('token', newToken);
            sessionStorage.setItem('id', String(decoded.userId));
            setToken(newToken);
            setUserId(Number(jwtDecode<JwtPayload>(newToken).userId))
        }
        catch (err) {
            console.error('Invalid JWT token: ', error);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id');
            setToken(null);
            setUserId(null);
        }
    }, []);

    const logout = useCallback(() => {
        setAuthToken(null);
    }, [setAuthToken]);

    let isAuthenticated: boolean = false;
    if (token) {
        try {
            isAuthenticated = !!token && (jwtDecode<JwtPayload>(token).exp > (Date.now()/1000));
        }
        catch {
            isAuthenticated = false;
        }
    }

    return {
        token,
        userId,
        setAuthToken,
        logout,
        isAuthenticated
    };
}