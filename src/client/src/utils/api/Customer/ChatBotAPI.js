import axios from "axios";

const BASE_URL = "http://localhost:9999/chatbot";

export const sendChatMessage = async (question) => {
    try {
        const res = await axios.post(`${BASE_URL}/new`, { question });
        return res.data.response;
    } catch (error) {
        console.error("Gửi câu hỏi đến chatbot thất bại:", error);
        return "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.";
    }
};
