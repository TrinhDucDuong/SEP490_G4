import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { X } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[80%] sm:w-80 md:w-96 bg-black text-white transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 z-50`}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 text-white hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200 mb-6"
                        aria-label="Đóng menu"
                    >
                        <X size={22} />
                    </button>

                    {/* Nav items */}
                    <nav className="flex-1 flex flex-col gap-3 text-base font-medium">
                        <Link
                            to="/"
                            onClick={onClose}
                            className={`py-2 px-3 rounded-lg transition-colors ${
                                location.pathname === "/"
                                    ? "bg-gray-800 text-teal-400"
                                    : "hover:bg-gray-800 hover:text-teal-400"
                            }`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/products"
                            onClick={onClose}
                            className={`py-2 px-3 rounded-lg transition-colors ${
                                location.pathname === "/products"
                                    ? "bg-gray-800 text-teal-400"
                                    : "hover:bg-gray-800 hover:text-teal-400"
                            }`}
                        >
                            Sản phẩm
                        </Link>
                        <Link
                            to="/feedbacks"
                            onClick={onClose}
                            className={`py-2 px-3 rounded-lg transition-colors ${
                                location.pathname === "/feedbacks"
                                    ? "bg-gray-800 text-teal-400"
                                    : "hover:bg-gray-800 hover:text-teal-400"
                            }`}
                        >
                            Feedback
                        </Link>
                        <Link
                            to="/blogs"
                            onClick={onClose}
                            className={`py-2 px-3 rounded-lg transition-colors ${
                                location.pathname === "/blogs"
                                    ? "bg-gray-800 text-teal-400"
                                    : "hover:bg-gray-800 hover:text-teal-400"
                            }`}
                        >
                            Bài viết
                        </Link>
                        <Link
                            to="/track-order"
                            onClick={onClose}
                            className={`py-2 px-3 rounded-lg transition-colors ${
                                location.pathname === "/track-order"
                                    ? "bg-gray-800 text-teal-400"
                                    : "hover:bg-gray-800 hover:text-teal-400"
                            }`}
                        >
                            Tra cứu đơn hàng
                        </Link>
                        <Link
                            to="/stores"
                            onClick={onClose}
                            className={`py-2 px-3 rounded-lg transition-colors ${
                                location.pathname === "/stores"
                                    ? "bg-gray-800 text-teal-400"
                                    : "hover:bg-gray-800 hover:text-teal-400"
                            }`}
                        >
                            Hệ thống cửa hàng
                        </Link>

                        {/* User section */}
                        {user ? (
                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-700 mt-4">
                                <span className="text-teal-400 px-3 text-sm">
                                    Xin chào, {user.username || user.email}
                                </span>
                                <Link
                                    to="/profile/order-history"
                                    onClick={onClose}
                                    className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors"
                                >
                                    Lịch sử đơn hàng
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={onClose}
                                    className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors"
                                >
                                    Cá nhân
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-left py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="py-2 px-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-colors"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
