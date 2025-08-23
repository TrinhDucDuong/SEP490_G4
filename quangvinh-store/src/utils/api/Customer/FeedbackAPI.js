import axios from "axios";

// Đối tượng FeedbackAPI chứa các hàm gọi API liên quan đến phản hồi (feedback)
export const FeedbackAPI = {
    // Hàm lấy tất cả phản hồi từ API
    // - Không cần truyền tham số
    // - Gửi request GET đến endpoint /feedback
    // - Trả về mảng feedbacks từ response
    fetchAll: async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/feedback`);
        return response.data.feedbacks;
    }
};
