import ReactDOM from "react-dom";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function Modal({ isOpen, onClose, children }) {
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            onClick={onClose}
                        >
                            ×
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default Modal;
