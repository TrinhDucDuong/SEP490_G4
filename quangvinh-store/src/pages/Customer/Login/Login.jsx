import React, {useState, useContext, useEffect} from 'react';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { FcGoogle } from 'react-icons/fc';
import logo from "../../../assets/images/logo_black.png";

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!identifier || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: identifier,
                    password: password,
                }),
            });
            const data = await res.json();
            console.log(data.account);
            if (res.ok && data.token) {
                localStorage.setItem('accountId', data.account.accountId);
                await login(data.account, data.token);
                navigate('/');
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmitGoogle = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-center my-20 bg-white">
                <div className="md:w-1/2 mr-24 space-y-6 md:space-y-8 max-w-md w-full h-full">
                    <h1 className="text-4xl font-sans text-black font-extrabold">
                        XÁC THỰC <span className="text-[#594AE2]">HÀNG AUTH</span><br />
                        TIN CẬY MỌI GIAO DỊCH
                    </h1>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => handleSubmitGoogle()}
                            className="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 transition w-full"
                            disabled={loading}
                        >
                            <FcGoogle size={20} />
                            <span className="text-sm font-medium text-gray-700">Đăng nhập với Google</span>
                        </button>

                        <button
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/facebook`}
                            className="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 transition w-full"
                            disabled={loading}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                                alt="Facebook"
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-medium text-gray-700">Đăng nhập với Facebook</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="rounded-full border border-gray-300 px-4 py-2 w-full"
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <input
                            className="rounded-full border border-gray-300 px-4 py-2 w-full"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-white bg-red-500 rounded-full px-4 py-2 text-sm">{error}</p>}

                        <div className="flex items-center">
                            <input className="mr-2" type="checkbox" id="remember" />
                            <label htmlFor="remember" className="text-sm">Giữ đăng nhập cho tôi</label>
                        </div>

                        <button
                            className="w-full bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm">
                                Bạn chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
                            </div>
                            <div className="text-sm text-right">
                                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>
                    </form>

                    <div className="mt-4 text-xs text-gray-600 leading-snug">
                        <p>
                            Bằng cách nhấn 'Đăng nhập', bạn đồng ý với <span className="underline cursor-pointer">Chính sách Bảo mật</span> của QuangVinhStore,
                            <span className="underline cursor-pointer"> Điều khoản thành viên</span> và
                            <span className="underline cursor-pointer"> Điều khoản trang Web</span>.
                        </p>
                    </div>
                </div>

                <div className="md:w-1/2 ml-24 bg-gray-200 shadow-md p-6 rounded-xl mt-10 md:mt-0 md:ml-10 max-w-md w-full h-full">
                    <h2 className="text-3xl font-bold mb-6">Tham gia thành viên ngay hôm nay!</h2>
                    <p className="mb-6 text-lg font-semibold text-black">Làm điều bạn thích, nhận thứ bạn mê!</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 mb-6 space-y-1">
                        <li>Miễn phí giao hàng</li>
                        <li>Giảm 15% cho lần mua tiếp theo</li>
                        <li>Ưu tiên sản phẩm và săn sale riêng</li>
                        <li>Ưu đãi và khuyến mãi đặc biệt</li>
                    </ul>
                    <p className="text-sm text-gray-600 mb-6">
                        Tham gia ngay để tích điểm, thăng hạng và mở khóa thêm nhiều quà tặng hấp dẫn!
                    </p>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition w-full">
                            Tham gia ngay
                        </button>
                    </Link>
                </div>
            </div>

            {/* Banner cuối */}
            <div className="bg-[#594AE2] p-4 rounded-t-3xl flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Gia nhập QUANG VINH.</h1>
                    <p className="text-lg">Ưu đãi 15% dành cho!</p>
                    <p className="text-sm">Đăng ký miễn phí! Tham gia cộng đồng ngay</p>
                    <div className="mt-4 flex space-x-4">
                        <input type="email" placeholder="Email Của Bạn" className="p-2 rounded-lg text-black" />
                        <button className="p-2 rounded-lg bg-black border-black text-white hover:bg-white hover:text-black">
                            Đăng ký ngay
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-48 items-end">
                    <Link to='/' className='block w-full h-full'>
                        <img
                            src={logo}
                            alt='Logo'
                            className='w-full h-full object-cover'
                            draggable={false}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Login;
