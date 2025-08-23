import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthForManager } from '../../context/AuthContextForManager';

const RoleBasedRoute = ({ children, allowedRoles = [], adminOnly = false }) => {
    const { isAuthenticated, loading, userRoles, isAdmin } = useAuthForManager();
    const location = useLocation();

    if (loading) return children;

    if (!isAuthenticated) {
        return <Navigate to="/manager/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/manager/category-management" replace />;
    }

    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role => userRoles.includes(role));
        if (!hasPermission) {
            return <Navigate to="/manager/category-management" replace />;
        }
    }

    return children;
};

export default RoleBasedRoute;
