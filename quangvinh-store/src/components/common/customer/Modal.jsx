import ReactDOM from "react-dom";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Component Modal dùng để hiển thị cửa sổ pop-up.
 * Props:
 * - isOpen: boolean, điều khiển hiển thị modal
 * - onClose: function, gọi khi đóng modal
 * - children: nội dung bên trong modal
 */
function Modal({ isOpen, onClose, children }) {
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                // Overlay nền tối, full màn hình
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}  // animation khi modal xuất hiện
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}     // animation khi modal đóng
                >
                    {/* Box modal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}  // bắt đầu nhỏ và mờ
                        animate={{ scale: 1, opacity: 1 }}    // animation khi mở
                        exit={{ scale: 0.8, opacity: 0 }}     // animation khi đóng
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative"
                        onClick={(e) => e.stopPropagation()} // tránh click overlay đóng modal
                    >
                        {/* Nút đóng modal */}
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            onClick={onClose}
                        >
                            ×
                        </button>

                        {/* Nội dung do người dùng truyền vào */}
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body // render modal ra ngoài DOM chính bằng portal
    );
}

export default Modal;
