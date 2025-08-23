import { useEffect, useState } from 'react';
import { fetchUser } from '../../utils/api/Customer/UserAPI.js';

// Custom hook để quản lý thông tin user, token và trạng thái đăng nhập
export const useFetchUser = () => {
    // State lưu thông tin user
    const [user, setUser] = useState(null);
    // State lưu token, khởi tạo từ localStorage nếu có
    const [token, setToken] = useState(localStorage.getItem('token'));
    // State kiểm soát trạng thái đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi nếu có
    const [error, setError] = useState('');

    useEffect(() => {
        // Nếu không có token, user không đăng nhập
        if (!token) {
            setUser(null);
            setLoading(false); // Kết thúc trạng thái loading
            return;
        }

        // Hàm bất đồng bộ để fetch dữ liệu user từ API
        const getUser = async () => {
            try {
                const data = await fetchUser(token); // Gọi API lấy thông tin user
                setUser(data); // Lưu dữ liệu user vào state
            } catch (err) {
                setError(err.message); // Lưu lỗi nếu có
                setUser(null); // Reset user nếu fetch thất bại
            } finally {
                setLoading(false); // Kết thúc loading dù thành công hay thất bại
            }
        };

        getUser(); // Gọi hàm fetch
    }, [token]); // Chạy lại khi token thay đổi

    // Hàm login, cập nhật thông tin user và token
    const login = (updatedUser, newToken) => {
        localStorage.setItem('token', newToken); // Lưu token vào localStorage
        setToken(newToken); // Cập nhật state token
        setUser(updatedUser); // Cập nhật state user
    };

    // Hàm logout, xóa token và user
    const logout = () => {
        localStorage.removeItem('token'); // Xóa token trong localStorage
        setUser(null); // Reset user
        setToken(null); // Reset token
    };

    // Trả về các state và hàm để component sử dụng
    return { user, token, loading, error, login, logout };
};
