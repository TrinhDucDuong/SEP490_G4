import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useFetchChatBoxAPI } from "../../../hooks/customer/useFetchChatBoxAPI.js";
import { motion } from "framer-motion";
import parse from "html-react-parser";

function ChatBoxAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const { handleSendToBot, loading } = useFetchChatBoxAPI();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { from: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        const botReply = await handleSendToBot(input);
        const botMsg = { from: "bot", text: botReply };

        setMessages((prev) => [...prev, botMsg]);
    };

    return (
        <div className="fixed bottom-4 sm:bottom-4 right-4 sm:right-6 ">
            {!isOpen ? (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all"
                    aria-label="Mở chatbox AI"
                >
                    <FaRobot className="text-lg sm:text-xl md:text-2xl" />
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-[90vw] max-w-[320px] sm:max-w-[400px] md:max-w-[450px] h-[400px] sm:h-[500px] md:h-[620px] bg-white text-black border border-gray-300 rounded-2xl shadow-2xl flex flex-col"
                >
                    <div className="bg-gradient-to-r from-black to-gray-800 text-white p-3 sm:p-4 flex justify-between items-center rounded-t-2xl">
                        <p className="font-semibold text-xs sm:text-sm md:text-base">Quang Vinh Store</p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-300 transition"
                        >
                            <IoClose className="text-lg sm:text-xl md:text-2xl" />
                        </button>
                    </div>

                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 sm:space-y-3 text-xs sm:text-sm scrollbar-thin scrollbar-thumb-gray-300">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`px-3 sm:px-4 py-2 rounded-xl w-fit max-w-[80%] leading-relaxed shadow-sm ${
                                    msg.from === "user"
                                        ? "bg-blue-100 ml-auto text-right"
                                        : "bg-gray-100 mr-auto text-left"
                                }`}
                            >
                                {parse(msg.text)}
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-gray-200 mr-auto text-left px-3 sm:px-4 py-2 rounded-xl max-w-[80%] text-xs sm:text-sm italic text-gray-500 shadow">
                                Đang trả lời...
                            </div>
                        )}
                    </div>

                    <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black transition disabled:opacity-50"
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-black text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition disabled:opacity-50"
                                disabled={loading}
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default ChatBoxAI;