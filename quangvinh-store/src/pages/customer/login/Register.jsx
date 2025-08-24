/**
 * @file Register.jsx
 * @description Component trang đăng ký tài khoản cho người dùng.
 * @author ngothangwork
 * @copyright 2025 ngothangwork
 */

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Component Register
 * Hiển thị form đăng ký tài khoản và thông tin ưu đãi dành cho thành viên mới.
 *
 * @component
 * @example
 * return (
 *   <Register />
 * )
 */
const Register = () => {
    /** @type {[string, Function]} username - Tên đăng nhập */
    const [username, setUsername] = useState('');
    /** @type {[string, Function]} password - Mật khẩu */
    const [password, setPassword] = useState('');
    /** @type {[string, Function]} confirmPassword - Nhập lại mật khẩu */
    const [confirmPassword, setConfirmPassword] = useState('');
    /** @type {[string, Function]} error - Thông báo lỗi */
    const [error, setError] = useState('');
    /** @type {[boolean, Function]} loading - Trạng thái đang xử lý */
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Scroll lên đầu trang mỗi khi pathname thay đổi
     */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    /**
     * Xử lý submit form đăng ký
     *
     * @param {React.FormEvent<HTMLFormElement>} e - Sự kiện submit form
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate('/login');
            } else {
                setError(data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center my-20 bg-white">
            <div className="md:w-1/2 mr-24 space-y-6 max-w-md w-full">
                <h1 className="text-4xl font-sans text-black font-extrabold">
                    ĐĂNG KÝ <span className="text-[#594AE2]">TÀI KHOẢN</span><br />
                    ĐỂ NHẬN ƯU ĐÃI
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="rounded-full border border-gray-300 px-4 py-2 w-full"
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="rounded-full border border-gray-300 px-4 py-2 w-full"
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="rounded-full border border-gray-300 px-4 py-2 w-full"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <p className="text-white bg-red-500 rounded-full px-4 py-2 text-sm">{error}</p>}
                    <button
                        className="w-full bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                    <div className="text-sm">
                        Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>
                    </div>
                </form>
            </div>

            <div className="md:w-1/2 ml-24 bg-gray-200 shadow-md p-6 rounded-xl mt-10 md:mt-0 max-w-md w-full">
                <h2 className="text-3xl font-bold mb-6">Tham gia thành viên hôm nay!</h2>
                <p className="mb-6 text-lg font-semibold">Ưu đãi đặc biệt dành cho bạn</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 mb-6 space-y-1">
                    <li>Miễn phí vận chuyển</li>
                    <li>Giảm giá đặc biệt</li>
                    <li>Ưu tiên sản phẩm hot</li>
                </ul>
                <p className="text-sm text-gray-600">
                    Hãy là một phần của Quang Vinh Store để nhận nhiều đặc quyền hấp dẫn.
                </p>
            </div>
        </div>
    );
};

export default Register;
