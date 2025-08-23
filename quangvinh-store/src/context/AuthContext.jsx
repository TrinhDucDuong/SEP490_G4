import { createContext, useState, useEffect } from 'react';
import { fetchUser } from '../utils/api/Customer/UserAPI.js';

// Tạo context để quản lý thông tin xác thực người dùng
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State lưu thông tin user
    const [user, setUser] = useState(null);
    // State lưu token, khởi tạo từ localStorage nếu có
    const [token, setToken] = useState(localStorage.getItem('token'));
    // State quản lý trạng thái loading khi fetch user
    const [loading, setLoading] = useState(true);

    // useEffect để fetch thông tin user khi token thay đổi
    useEffect(() => {
        const getUser = async () => {
            // Nếu không có token, user chưa đăng nhập
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                // Gọi API lấy thông tin user
                const data = await fetchUser(token);

                // Nếu API trả về object account, kết hợp token vào user
                if (data.account) {
                    setUser({ ...data.account, token });
                } else {
                    setUser(data); // Nếu không có account, dùng dữ liệu trả về trực tiếp
                }

                console.log(data); // Debug dữ liệu user
            } catch (err) {
                console.error("Lỗi khi fetch user:", err);
                setUser(null); // Reset user nếu fetch thất bại
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        getUser();
    }, [token]);

    // Hàm login, cập nhật thông tin user và token
    const login = (userData, newToken) => {
        localStorage.setItem('token', newToken); // Lưu token vào localStorage
        setToken(newToken); // Cập nhật state token
        // Nếu userData có account, kết hợp token vào
        if (userData.account) {
            setUser({ ...userData.account, token: newToken });
        } else {
            setUser(userData); // Nếu không, dùng trực tiếp userData
        }
    };

    // Hàm logout, xóa token, thông tin cart và user
    const logout = async () => {
        // Xóa dữ liệu liên quan tới user và giỏ hàng trên localStorage
        localStorage.removeItem('cart');
        localStorage.removeItem('accountId');
        localStorage.removeItem('token');
        localStorage.removeItem('guest_cart');

        // Reset state
        setToken(null);
        setUser(null);

        // Chuyển về trang chủ
        window.location.href = '/';

    };

    // Provider truyền các giá trị xuống các component con
    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
