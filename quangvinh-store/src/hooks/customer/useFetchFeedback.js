import { useEffect, useState } from "react";
import { FeedbackAPI } from "../../utils/api/Customer/FeedbackAPI.js";

export default function useFetchFeedback() {
    // State lưu danh sách feedback
    const [feedbacks, setFeedbacks] = useState([]);
    // State quản lý trạng thái loading
    const [loading, setLoading] = useState(true);
    // State quản lý lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Gọi API lấy toàn bộ feedback
                const data = await FeedbackAPI.fetchAll();
                setFeedbacks(data || []); // Nếu không có data thì trả về []
            } catch (err) {
                // Nếu lỗi thì lưu error để hiển thị ở UI
                setError(err.message || "Không thể tải feedback.");
            } finally {
                // Dù thành công hay thất bại thì cũng tắt loading
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    // Trả dữ liệu, trạng thái loading, và lỗi để component có thể xử lý
    return { feedbacks, loading, error };
}
