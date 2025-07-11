import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthForManager } from '../../context/AuthContextForManager';

const ProtectedRouteForManager = ({ children }) => {
    const { isAuthenticated, loading } = useAuthForManager();
    const location = useLocation();

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="animate-spin h-10 w-10 border-4 border-blue-600 border-b-transparent rounded-full" />
            </div>
        );

    if (!isAuthenticated)
        return <Navigate to="/admin/login" state={{ from: location }} replace />;

    return children;
};

export default ProtectedRouteForManager;
