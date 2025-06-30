import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout();
        console.log("Đã gọi logout từ Sidebar");
        onClose();
        window.location.href = '/login';
    };

    return (
        <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50`}>
            <div className="p-4">
                <button onClick={onClose} className="text-white mb-4">Đóng</button>
                <nav className="flex flex-col gap-4">
                    <Link to="/" onClick={onClose} className="hover:text-yellow-400">Trang chủ</Link>
                    <Link to="/products" onClick={onClose} className="hover:text-yellow-400">Sản phẩm</Link>
                    <Link to="/contacts" onClick={onClose} className="hover:text-yellow-400">Liên hệ</Link>
                    <Link to="/sale" onClick={onClose} className="hover:text-yellow-400">Sale</Link>
                    <Link to="/feedbacks" onClick={onClose} className="hover:text-yellow-400">Feedback</Link>
                    {user ? (
                        <div className="flex flex-col gap-4">
                            <span className="hover:text-yellow-400">Xin chào, {user.username || user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="hover:text-yellow-400 text-left"
                            >
                                Đăng Xuất
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={onClose} className="hover:text-yellow-400">Đăng Nhập</Link>
                    )}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;