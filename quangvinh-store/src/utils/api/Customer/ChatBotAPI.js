import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/chatbot`;

// Hàm gửi câu hỏi đến chatbot
// - Tham số: question (chuỗi câu hỏi của người dùng)
// - Gửi request POST đến endpoint /chatbot/new với body { question }
// - Nếu thành công: trả về res.data.response (câu trả lời từ chatbot)
// - Nếu thất bại: in lỗi ra console và trả về thông báo mặc định cho người dùng
export const sendChatMessage = async (question) => {
    try {
        const res = await axios.post(`${BASE_URL}/new`, { question });
        return res.data.response;
    } catch (error) {
        console.error("Gửi câu hỏi đến chatbot thất bại:", error);
        return "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.";
    }
};
