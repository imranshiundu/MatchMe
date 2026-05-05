import { useState, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

type JwtPayload = {
    userId: number;
    sub: string;
    exp: number;
};

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
    const [userId, setUserId] = useState<number | null>(Number(sessionStorage.getItem('id')));

    const setAuthToken = useCallback((newToken: string | null) => {
        if (!newToken) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('email');
            setToken(null);
            setUserId(null);
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(newToken);
            sessionStorage.setItem('token', newToken);
            sessionStorage.setItem('id', String(decoded.userId));
            sessionStorage.setItem('email', decoded.sub);
            setToken(newToken);
            setUserId(decoded.userId);
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

    const getUserEmail = () => {
        const stored = sessionStorage.getItem('email');
        if (stored) return stored;
        if (token) {
            try {
                return jwtDecode<JwtPayload>(token).sub;
            } catch {
                return null;
            }
        }
        return null;
    };

    return {
        token,
        userId,
        userEmail: getUserEmail(),
        setAuthToken,
        logout,
        isAuthenticated
    };
}