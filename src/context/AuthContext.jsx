import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // try to set token in axios interceptor (api already does that)
            // optionally fetch user profile if endpoint exists
            setUser({ token }); // minimal
        }
        setReady(true);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, ready }}>
            {children}
        </AuthContext.Provider>
    );
}
