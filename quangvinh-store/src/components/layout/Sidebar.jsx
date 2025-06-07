import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
    return (
        <div className={`
      fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 p-6 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={onClose} aria-label="Close Menu">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex flex-col gap-4">
                <Link to="/" onClick={onClose} className="hover:text-yellow-400">Trang chủ</Link>
                <Link to="/products" onClick={onClose} className="hover:text-yellow-400">Sản phẩm</Link>
                <Link to="/sale" onClick={onClose} className="hover:text-yellow-400">Sale</Link>
                <Link to="/feedbacks" onClick={onClose} className="hover:text-yellow-400">Feedback</Link>
                <Link to="/cart" onClick={onClose} className="hover:text-yellow-400">Cart</Link>
                <Link to="/login" onClick={onClose} className="hover:text-yellow-400">Login</Link>
            </nav>
        </div>
    );
}

export default Sidebar;
