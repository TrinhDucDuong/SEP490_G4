import { useState } from "react";
import { FaComments } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function ChatBoxAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { from: "user", text: input }]);
        setInput("");

        setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: "Xin chào! Tôi là AI hỗ trợ." }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white p-4 rounded-full shadow-xl hover:bg-gray-800 transition"
                >
                    <FaComments size={22} />
                </button>
            ) : (
                <div className="w-[400px] h-[600px] bg-white text-black border border-gray-300 rounded-xl shadow-2xl flex flex-col">
                    <div className="bg-black text-white p-4 flex justify-between items-center rounded-t-xl">
                        <p className="font-semibold text-sm">Quang Vinh Store - Trợ lý AI</p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:text-gray-300"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`px-4 py-2 rounded-lg max-w-[75%] leading-relaxed ${
                                    msg.from === "user"
                                        ? "bg-gray-100 ml-auto text-right"
                                        : "bg-gray-200 mr-auto text-left"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBoxAI;
