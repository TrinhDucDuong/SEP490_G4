import { useState, useContext, useEffect } from 'react';
import { Menu } from 'lucide-react';
import logo from '../../../assets/images/logo_black.png';
import Sidebar from './Sidebar.jsx';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../../context/AuthContext.jsx';
import Cart from '../../../pages/Customer/Cart.jsx';
import Search from '../../../pages/Customer/Search.jsx';

function Header() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const accountId = localStorage.getItem('accountId');

    const handleLogout = () => {
        logout();
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    return (
        <>
            <header className='bg-white text-black w-full fixed top-0 z-50 shadow-md border-b border-gray-200'>
                <div className='container mx-auto flex items-center justify-between h-20 px-4 md:px-8'>
                    <button
                        className='xl:hidden flex items-center justify-center p-2 hover:bg-gray-100 rounded-md transition'
                        onClick={() => setSidebarOpen(true)}
                        aria-label='Mở menu'
                    >
                        <Menu size={24} />
                    </button>
                    <div className='w-40 h-16 overflow-hidden relative'>
                        <Link to='/' className='block w-full h-full'>
                            <img
                                src={logo}
                                alt='Logo'
                                className='w-full h-full object-cover'
                                draggable={false}
                            />
                        </Link>
                    </div>

                    <nav className='hidden xl:flex flex-1 justify-center max-w-[720px] mx-auto'>
                        <ul className='flex flex-wrap justify-center gap-2 font-sans text-sm font-semibold text-gray-700'>
                            <li>
                                <Link to='/' className='py-2 px-3 rounded-md hover:bg-black hover:text-yellow-400 transition duration-200'>Trang chủ</Link>
                            </li>
                            <li>
                                <Link to='/products' className='py-2 px-3 rounded-md hover:bg-black hover:text-yellow-400 transition duration-200'>Sản phẩm</Link>
                            </li>
                            <li>
                                <Link to='/feedbacks' className='py-2 px-3 rounded-md hover:bg-black hover:text-yellow-400 transition duration-200'>Feedback</Link>
                            </li>
                            <li>
                                <Link to='/contacts' className='py-2 px-3 rounded-md hover:bg-black hover:text-yellow-400 transition duration-200'>Liên hệ</Link>
                            </li>
                            <li>
                                <Link to='/sale' className='py-2 px-3 rounded-md hover:bg-black hover:text-yellow-400 transition duration-200 relative'>
                                    <span className='absolute -top-1 -right-2 text-[10px] bg-red-600 text-white px-1 rounded'>HOT</span>
                                    Sale
                                </Link>
                            </li>
                            <li>
                                <Link to='/blog' className='py-2 px-3 rounded-md hover:bg-black hover:text-yellow-400 transition duration-200 text-center'>Hàng Auth chuẩn có gì?</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex items-center gap-3 lg:gap-6'>
                        <div className='hidden sm:block'>
                            <div className='border border-gray-300 rounded-full px-3 py-1.5 flex items-center gap-2 transition focus-within:ring-2 focus-within:ring-yellow-400'>
                                <input
                                    type='text'
                                    className='outline-none text-sm bg-transparent placeholder-gray-400 w-28 md:w-40'
                                    placeholder='Tìm sản phẩm...'
                                />
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className='text-gray-600 hover:text-yellow-500 transition'
                                >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} size='sm' />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setCartOpen(true)}
                            className='hover:text-yellow-400 transition'
                            aria-label='Yêu thích'
                        >
                            <FontAwesomeIcon icon={faHeart} size='lg' />
                        </button>
                        <button
                            onClick={() => setCartOpen(true)}
                            className='hover:text-yellow-400 transition'
                            aria-label='Giỏ hàng'
                        >
                            <FontAwesomeIcon icon={faCartShopping} size='lg' />
                        </button>
                        {user ? (
                            <div className='relative hidden lg:flex items-center gap-3'>
                                <button
                                    onClick={toggleDropdown}
                                    className='text-gray-700 hover:text-yellow-500 transition focus:outline-none'
                                    aria-label='Tài khoản'
                                >
                                    <FontAwesomeIcon icon={faUser} size='lg' />
                                </button>
                                {isDropdownOpen && (
                                    <div className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                                        <ul className='py-1'>
                                            <li>
                                                <Link to='/profile/order-history' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => setDropdownOpen(false)}>Lịch sử đơn hàng</Link>
                                            </li>
                                            <li>
                                                <Link to='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => setDropdownOpen(false)}>Cá nhân</Link>
                                            </li>
                                            <li>
                                                <button onClick={() => { handleLogout(); setDropdownOpen(false); }} className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Đăng xuất</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to='/login' className='text-sm text-gray-700 hover:text-yellow-500 transition hidden lg:inline'>
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {isCartOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-40'
                    onClick={() => setCartOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Cart isOpen={isCartOpen} accountId={accountId} onClose={() => setCartOpen(false)} />
            <Search isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
            <div className='h-20'></div>
        </>
    );
}

export default Header;
