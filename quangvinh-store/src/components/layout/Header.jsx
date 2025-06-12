import { useState, useContext } from 'react';
import { Menu } from 'lucide-react';
import logo from '../../assets/images/logo_white.png';
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext.jsx';

function Header() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    console.log("Trạng thái user trong Header:", user);
    const handleLogout = () => {
        logout();
        console.log("Đã gọi logout từ Header");
        window.location.href = '/login';
    };

    return (
        <>
            <header className="hover:bg-black transition-transform duration-300 text-white w-full absolute top-0 z-50 p-1">
                <div className="mx-auto flex items-center justify-between py-4 px-4 md:px-0 relative">
                    <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open Menu">
                        <Menu size={24} />
                    </button>
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <img src={logo} alt="Logo" className="h-28 w-56 object-cover" />
                    </div>
                    <div className="hidden lg:flex flex-col gap-1 pl-3 font-sans text-lg font-normal tracking-wide">
                        <div className="flex flex-row gap-4">
                            <Link to="/" className="hover:text-yellow-400 transition mr-2">Trang chủ</Link>
                            <Link to="/products" className="hover:text-yellow-400 transition mr-2">Sản phẩm</Link>
                            <Link to="/contacts" className="hover:text-yellow-400 transition mr-2">Liên hệ</Link>
                            <Link to="/sale" className="hover:text-yellow-400 transition mr-2">Sale</Link>
                        </div>
                        <div className="flex flex-row gap-4">
                            <Link to="/feedbacks" className="hover:text-yellow-400 transition">Feedback</Link>
                        </div>
                    </div>
                    <div className="hidden lg:flex gap-6 pr-3 text-lg font-sans items-center">
                        <Link to="/search" className="hover:text-yellow-400 mr-2">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Link>
                        <Link to="/cart" className="hover:text-yellow-400 mr-2">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="hover:text-yellow-400">Xin chào, {user.username || user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-yellow-400"
                                >
                                    Đăng Xuất
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-yellow-400 mr-2">Đăng Nhập</Link>
                        )}
                    </div>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
}

export default Header;