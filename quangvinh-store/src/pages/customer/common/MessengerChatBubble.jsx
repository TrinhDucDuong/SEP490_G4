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
            className="bg-[#0084FF] p-4 rounded-full shadow-lg text-white flex items-center justify-center"
            aria-label="Chat với chúng tôi trên Messenger"
        >
            <FaFacebookMessenger size={22} />
        </motion.button>
    );
}

export default MessengerChatBubble;
