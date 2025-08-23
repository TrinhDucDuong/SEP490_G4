import { useEffect, useState } from "react";

// Custom hook để fetch dữ liệu blogs từ API
export const useFetchBlogs = () => {
    // State lưu danh sách blog
    const [blogs, setBlogs] = useState([]);
    // State quản lý trạng thái đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm bất đồng bộ để gọi API lấy blog
        const fetchData = async () => {
            try {
                // Gọi API lấy dữ liệu blog
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog`);

                // Nếu phản hồi không OK (status != 200-299) thì ném lỗi
                if (!response.ok) {
                    throw new Error('Failed to fetch blog');
                }

                // Chuyển dữ liệu JSON từ response
                const data = await response.json();

                // Lưu danh sách blog vào state, nếu không có thì gán mảng rỗng
                setBlogs(data.blogs || []);
            } catch (err) {
                // Nếu có lỗi thì lưu message lỗi
                setError(err.message || 'Something went wrong');
            } finally {
                // Dù thành công hay thất bại cũng tắt trạng thái loading
                setLoading(false);
            }
        };

        // Gọi hàm fetchData ngay khi component mount
        fetchData();
    }, []); // [] => chỉ chạy 1 lần duy nhất khi component mount

    // Trả về blogs, trạng thái loading, và error để component khác dùng
    return { blogs, loading, error };
};
