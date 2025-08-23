import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext.jsx";

/**
 * Component xử lý redirect sau khi đăng nhập OAuth2.
 * Nó lấy token, accountId, username từ query string, lưu vào localStorage và context.
 * Sau đó redirect về trang chủ.
 */
const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        // Lấy query params từ URL
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const accountId = searchParams.get('accountId');
        const username = searchParams.get('username');

        // Lưu vào localStorage để giữ trạng thái đăng nhập
        localStorage.setItem('token', token);
        localStorage.setItem('accountId', accountId);
        localStorage.setItem('username', username);

        // Nếu đủ thông tin, cập nhật context Auth
        if (token && accountId && username) {
            const userData = {
                accountId: Number(accountId),
                username,
            };
            login({ account: userData }, token); // cập nhật user trong context
        }

        // Chuyển hướng về trang chủ
        window.location.href = '/';
    }, [location, login, navigate]);

    // Component này không render gì
    return null;
};

export default OAuth2RedirectHandler;
