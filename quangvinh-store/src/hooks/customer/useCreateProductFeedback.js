import { useState } from "react";
import { createProductFeedback } from "../../utils/api/Customer/StarRateAPI.js";

// Custom hook: dùng để gọi API tạo feedback (đánh giá) cho sản phẩm
const useCreateProductFeedback = () => {
    // State quản lý quá trình gọi API
    const [loading, setLoading] = useState(false); // true khi đang gửi feedback
    const [error, setError] = useState(null);      // lưu thông báo lỗi (nếu có)
    const [success, setSuccess] = useState(false); // true nếu gửi thành công

    // Hàm submit feedback
    const submitFeedback = async (data) => {
        setLoading(true);   // bật trạng thái loading
        setError(null);     // reset lỗi trước đó
        try {
            await createProductFeedback(data); // gọi API tạo feedback
            setSuccess(true);                  // nếu không lỗi thì đánh dấu thành công
        } catch (err) {
            // Nếu lỗi -> lưu message lỗi, mặc định "Lỗi không xác định"
            setError(err.message || "Lỗi không xác định");
        } finally {
            setLoading(false); // tắt trạng thái loading (thành công hay thất bại đều tắt)
        }
    };

    // Trả về các state và hàm để component khác sử dụng
    return { submitFeedback, loading, error, success };
};

export default useCreateProductFeedback;
