import { useState, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));

    const setAuthToken = useCallback((newToken: string | null) => {
        if (newToken) {
            sessionStorage.setItem('token', newToken);
        } else {
            sessionStorage.removeItem('token');
        }
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        setAuthToken(null);
    }, [setAuthToken]);

    const isAuthenticated: boolean = !!token && (jwtDecode(token).exp > (Date.now()/1000));

    return {
        token,
        setAuthToken,
        logout,
        isAuthenticated
    };
}