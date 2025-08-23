import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "../../../../context/AuthContext.jsx";

// Component này dùng để bảo vệ các route cần đăng nhập
// Nếu người dùng đã đăng nhập (có token) thì hiển thị children
// Ngược lại, redirect về trang /login
const ProtectedRoute = ({ children }) => {
    // Lấy token từ AuthContext
    const { token } = useContext(AuthContext);

    // Nếu có token => hiển thị component con, nếu không => chuyển hướng tới /login
    return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
