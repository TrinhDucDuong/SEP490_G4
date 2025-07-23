import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/chatbot`;

export const sendChatMessage = async (question) => {
    try {
        const res = await axios.post(`${BASE_URL}/new`, { question });
        return res.data.response;
    } catch (error) {
        console.error("Gửi câu hỏi đến chatbot thất bại:", error);
        return "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.";
    }
};
