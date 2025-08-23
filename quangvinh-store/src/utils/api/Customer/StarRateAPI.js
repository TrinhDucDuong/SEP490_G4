import axios from "axios";

// Hàm tạo mới feedback (đánh giá sao) cho sản phẩm
// - Tham số: data (object chứa thông tin đánh giá: productId, rating, comment, ...)
// - Lấy token từ localStorage để xác thực người dùng
// - Gửi request POST đến endpoint /star-rate với body = data
// - Headers: Authorization (Bearer token), Content-Type: application/json
// - Nếu thành công: trả về response.data (dữ liệu phản hồi từ server)
// - Nếu thất bại: ném ra error.response.data (nếu server có trả về lỗi)
//   hoặc object { message: "Đã có lỗi xảy ra" } nếu không có thông tin chi tiết
export const createProductFeedback = async (data) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/star-rate`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // xác thực bằng JWT token
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
};
