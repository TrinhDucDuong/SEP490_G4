/**
 * @file MessengerChatBubble.jsx
 * @description Component nút chat Messenger nổi (bubble) ở góc màn hình, mở trang Messenger trong tab mới khi nhấn.
 * Bao gồm:
 * - Hiệu ứng animation khi xuất hiện, hover và tap với Framer Motion
 * - Sử dụng icon FaFacebookMessenger
 * @author ngothangwork
 * @copyright 2025 ngothangwork
 */

import React from "react";
import { motion } from "framer-motion";
import { FaFacebookMessenger } from "react-icons/fa";

function MessengerChatBubble() {
    const handleOpenMessenger = () => {
        window.open(
            "https://www.facebook.com/messages/t/170429579491938",
            "_blank"
        );
    };

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenMessenger}
            className="bg-[#0084FF] p-3 sm:p-4 rounded-full shadow-lg text-white flex items-center justify-center"
            aria-label="Chat với chúng tôi trên Messenger"
        >
            <FaFacebookMessenger className="text-lg sm:text-xl md:text-2xl" />
        </motion.button>
    );
}

export default MessengerChatBubble;