import { useState } from 'react';
import { Menu } from 'lucide-react';
import logo from '../../../../../mergecode/quangvinh-store/src/assets/images/logo_white.png';
import Sidebar from './customer/Sidebar.jsx';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';


function HeaderNoHover() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <header className=" bg-black transition-transform duration-300 text-white w-full absolute top-0 z-50 p-1">
                <div className=" mx-auto flex items-center justify-between py-4 px-4 md:px-0 relative">
                    <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open Menu">
                        <Menu size={24} />
                    </button>
                    <div className="absolute left-1/2 transform -translate-x-1/2 ">
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
                    <div className="hidden lg:flex gap-6 pr-3 text-lg font-sans">
                        <Link to="/login" className="hover:text-yellow-400 mr-2">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Link>
                        <Link to="/cart" className="hover:text-yellow-400 mr-2">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Link>
                        <Link to="/login" className="hover:text-yellow-400 mr-2">Login</Link>
                    </div>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
}

export default HeaderNoHover;