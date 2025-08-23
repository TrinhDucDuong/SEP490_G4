import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Component ConfirmDialog hiển thị hộp thoại xác nhận xoá hoặc hành động quan trọng.
 * Props:
 * - isOpen: boolean, điều khiển hiển thị dialog
 * - onClose: function, gọi khi người dùng nhấn Hủy hoặc đóng dialog
 * - onConfirm: function, gọi khi người dùng nhấn Xoá
 * - message: string, nội dung hiển thị trong dialog
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, message }) {
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                // Overlay nền tối, full màn hình
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}      // animation khi vào
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}        // animation khi ra
                >
                    {/* Box dialog */}
                    <motion.div
                        className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
                        initial={{ scale: 0.9, opacity: 0 }}  // animation nhỏ và mờ khi xuất hiện
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}    // animation nhỏ và mờ khi thoát
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Tiêu đề */}
                        <h3 className="text-lg font-bold mb-4">Xác nhận</h3>

                        {/* Nội dung thông báo */}
                        <p className="text-sm text-gray-700 mb-6">
                            {message || "Bạn có chắc chắn muốn xoá?"}
                        </p>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-2">
                            {/* Nút Hủy */}
                            <button
                                onClick={onClose}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>

                            {/* Nút Xoá */}
                            <button
                                onClick={() => {
                                    onConfirm(); // gọi callback khi xác nhận
                                    onClose();   // đóng dialog sau khi xác nhận
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Xoá
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body // tạo portal vào body để hiển thị overlay full màn hình
    );
}

export default ConfirmDialog;
