import { useState, useContext } from 'react';
import { Menu } from 'lucide-react';
import logo from '../../assets/images/logo_black.png';
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext.jsx';
import Cart from "../../pages/Admin/Cart.jsx";
import Search from "../../pages/Admin/Search.jsx";

function Header() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <>
            <header className="bg-white text-black w-full fixed top-0 z-50 shadow-lg">
                <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8">
                    <button className="lg:hidden flex items-center justify-center p-2" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
                        <Menu size={24} />
                    </button>
                    <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 z-10">
                        <Link to="/">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-28 w-56 md:h-20 object-cover"
                                draggable={false}
                            />
                        </Link>
                    </div>
                    <nav className="hidden lg:flex flex-1 justify-center">
                        <ul className="flex gap-6 font-sans text-base font-medium">
                            <li>
                                <Link to="/" className="hover:text-yellow-400 transition">Trang chủ</Link>
                            </li>
                            <li>
                                <Link to="/products" className="hover:text-yellow-400 transition">Sản phẩm</Link>
                            </li>
                            <li>
                                <Link to="/sale" className="hover:text-yellow-400 transition">Sale</Link>
                            </li>
                            <li>
                                <Link to="/contacts" className="hover:text-yellow-400 transition">Liên hệ</Link>
                            </li>
                            <li>
                                <Link to="/feedbacks" className="hover:text-yellow-400 transition">Feedback</Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="flex items-center gap-4 lg:gap-6">
                        <button onClick={() => setSearchOpen(true)} className="hover:text-yellow-400 transition" aria-label="Tìm kiếm">
                            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                        </button>
                        <button onClick={() => setCartOpen(true)} className="hover:text-yellow-400 transition" aria-label="Giỏ hàng">
                            <FontAwesomeIcon icon={faCartShopping} size="lg" />
                        </button>
                        {user ? (
                            <div className="hidden lg:flex items-center gap-2">
                                <span className="text-sm">Xin chào, <b>{user.username || user.email}</b></span>
                                <button onClick={handleLogout} className="hover:text-yellow-400 text-sm">
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-yellow-400 text-sm hidden lg:inline">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            <Search isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
            <div className="h-20"></div>
        </>
    );
}

export default Header;