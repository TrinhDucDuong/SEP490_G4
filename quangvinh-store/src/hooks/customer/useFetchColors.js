import { useEffect, useState } from "react";

export function useFetchColors() {
    // State lưu danh sách màu lấy từ API
    const [colors, setColors] = useState([]);
    // State quản lý trạng thái đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông tin lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm async để gọi API lấy danh sách màu
        const fetchColors = async () => {
            try {
                // Gọi API lấy danh sách màu từ server
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/color`);

                // Nếu response không thành công thì ném lỗi
                if (!res.ok) throw new Error("Failed to fetch colors");

                // Chuyển dữ liệu từ JSON sang object
                const data = await res.json();

                // Gán danh sách màu vào state (nếu API trả về đúng key)
                setColors(data.colorHex || []);
            } catch (err) {
                // Nếu có lỗi thì lưu vào state error
                setError(err.message || "Unknown error");
            } finally {
                // Dù thành công hay thất bại thì vẫn tắt loading
                setLoading(false);
            }
        };

        // Gọi hàm fetch ngay khi component mount
        fetchColors();
    }, []); // [] => chỉ chạy 1 lần khi component mount

    // Trả về dữ liệu, trạng thái loading, và lỗi để component có thể dùng
    return { colors, loading, error };
}
