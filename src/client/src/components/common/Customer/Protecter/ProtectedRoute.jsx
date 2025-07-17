import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import {AuthContext} from "../../../../context/AuthContext.jsx";


const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
