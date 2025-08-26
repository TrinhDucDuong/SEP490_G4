import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthForManager } from '../../context/AuthContextForManager';

const RoleBasedRoute = ({ children, allowedRoles = [], adminOnly = false }) => {
    const { isAuthenticated, loading, userRoles, isAdmin, token, user } = useAuthForManager();
    const location = useLocation();

    // Debug logging
    console.log('RoleBasedRoute check:', {
        loading,
        isAuthenticated,
        hasToken: !!token,
        hasUser: !!user,
        path: location.pathname
    });

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/manager/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !isAdmin()) {
        console.log('Admin required but user is not admin');
        return <Navigate to="/manager/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role => userRoles.includes(role));
        if (!hasPermission) {
            console.log('Insufficient permissions');
            return <Navigate to="/manager/login" replace />;
        }
    }

    return children;
};

export default RoleBasedRoute;
