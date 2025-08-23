import { useState } from "react";
import { sendChatMessage } from "../../utils/api/Customer/ChatBotAPI.js";

// Custom hook để gửi câu hỏi đến ChatBot API và nhận câu trả lời
export const useFetchChatBoxAPI = () => {
    // State quản lý trạng thái loading khi gửi tin nhắn
    const [loading, setLoading] = useState(false);

    // Hàm xử lý khi gửi câu hỏi đến chatbot
    const handleSendToBot = async (question) => {
        setLoading(true); // bật trạng thái loading khi đang gọi API

        // Gọi API gửi câu hỏi lên server và nhận về câu trả lời
        const answer = await sendChatMessage(question);

        setLoading(false); // tắt loading sau khi API phản hồi
        return answer; // trả về câu trả lời của chatbot
    };

    // Trả về hàm gửi tin nhắn và trạng thái loading để component có thể sử dụng
    return {
        handleSendToBot,
        loading,
    };
};
