import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { X } from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50`}>
            <div className="p-6">
                <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 text-white hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200 mb-6"
                    aria-label="Đóng menu"
                >
                    <X size={20} />
                </button>
                <nav className="flex flex-col gap-4 text-sm font-semibold">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                    >
                        Trang chủ
                    </Link>
                    <Link
                        to="/products"
                        onClick={onClose}
                        className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                    >
                        Sản phẩm
                    </Link>
                    <Link
                        to="/feedbacks"
                        onClick={onClose}
                        className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                    >
                        Feedback
                    </Link>
                    <Link
                        to="/contacts"
                        onClick={onClose}
                        className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                    >
                        Liên hệ
                    </Link>
                    <Link
                        to="/sale"
                        onClick={onClose}
                        className="relative py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                    >
                        Sale
                        <span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            HOT
                        </span>
                    </Link>
                    <Link
                        to="/blog"
                        onClick={onClose}
                        className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                    >
                        Hàng Auth chuẩn có gì?
                    </Link>
                    {user ? (
                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-700">
                            <span className="text-teal-400 px-3">Xin chào, {user.username || user.email}</span>
                            <Link
                                to="/order-history"
                                onClick={onClose}
                                className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                            >
                                Lịch sử đơn hàng
                            </Link>
                            <Link
                                to="/profile"
                                onClick={onClose}
                                className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                            >
                                Cá nhân
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-left py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors duration-200"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;