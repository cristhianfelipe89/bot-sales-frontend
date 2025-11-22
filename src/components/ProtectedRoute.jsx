// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles = [] }) {
    const { authState } = useContext(AuthContext);
    if (!authState?.user) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(authState.user.role)) return <Navigate to="/unauthorized" replace />;
    return <Outlet />;
}
