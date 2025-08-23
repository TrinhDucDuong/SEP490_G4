import { useEffect, useState } from "react";

// Custom hook dùng để fetch dữ liệu đánh giá sao (star rate) của một sản phẩm
export const useFetchStarRate = (productId, filterStar = '', pageNumber = 0, pageSize = 3) => {
    // State lưu danh sách các đánh giá sao
    const [starRates, setStarRates] = useState([]);
    // State lưu tổng số lượng đánh giá (để dùng cho phân trang)
    const [totalCount, setTotalCount] = useState(0);
    // State kiểm soát trạng thái loading (đang tải hay không)
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu không có productId thì không fetch dữ liệu
        if (!productId) return;

        // Hàm bất đồng bộ để gọi API
        const fetchData = async () => {
            try {
                setLoading(true); // Bắt đầu gọi API => bật trạng thái loading

                // Tạo query params cho API bằng URLSearchParams
                const params = new URLSearchParams({
                    productId,
                    pageNumber,
                    pageSize,
                });

                // Nếu filterStar khác rỗng thì mới thêm tham số lọc số sao
                if (filterStar !== '') {
                    params.append('numberOfStarRate', filterStar);
                }

                // Gọi API lấy dữ liệu đánh giá sao
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/star-rate?${params.toString()}`);
                const data = await res.json();

                // Cập nhật danh sách đánh giá và tổng số đánh giá
                setStarRates(data.starRate || []);
                setTotalCount(data.totalElements || 0);
            } catch (err) {
                // Nếu có lỗi trong quá trình gọi API thì lưu vào state error
                setError(err.message);
            } finally {
                // Dù thành công hay thất bại thì cũng tắt trạng thái loading
                setLoading(false);
            }
        };

        // Gọi hàm fetch dữ liệu
        fetchData();

        // Hook sẽ chạy lại mỗi khi productId, filterStar, pageNumber hoặc pageSize thay đổi
    }, [productId, filterStar, pageNumber, pageSize]);

    // Trả về dữ liệu và các trạng thái cho component sử dụng
    return { starRates, totalCount, loading, error };
};
