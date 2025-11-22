// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ token: null, user: null });
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token) {
            try {
                const user = userStr ? JSON.parse(userStr) : jwt_decode(token);
                setAuthState({ token, user });
            } catch (err) {
                console.error("Invalid token", err);
                handleLogout();
            }
        }
    }, []);

    const handleLogin = (userOrToken, maybeToken) => {
        let token, user;
        if (maybeToken) { user = userOrToken; token = maybeToken; }
        else { token = userOrToken; user = jwt_decode(token); }
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuthState({ token, user });
        // navigate handled by caller
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({ token: null, user: null });
        window.location.href = "/";
    };

    return <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>{children}</AuthContext.Provider>;
};
