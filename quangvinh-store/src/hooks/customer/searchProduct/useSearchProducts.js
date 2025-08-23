import { useState, useEffect } from "react";
import axios from "axios";

export default function useSearchProducts(query) {
    // State lưu kết quả tìm kiếm
    const [results, setResults] = useState([]);
    // State lưu trạng thái loading (đang tải dữ liệu hay không)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Tạo độ trễ 300ms (debounce) để tránh gọi API liên tục khi người dùng gõ nhanh
        const delayDebounce = setTimeout(() => {
            // Nếu query có ký tự (không rỗng)
            if (query.trim()) {
                setLoading(true); // Bật trạng thái loading

                // Gọi API tìm kiếm sản phẩm
                axios
                    .get(`${import.meta.env.VITE_API_BASE_URL}/product`, {
                        params: {
                            minPrice: 0,            // Giá tối thiểu
                            sortDirection: 'desc',  // Sắp xếp giảm dần
                            sortBy: 'createdAt',    // Sắp xếp theo ngày tạo
                            pageNumber: 0,          // Trang đầu tiên
                            pageSize: 10,           // Giới hạn 10 sản phẩm
                            searchText: query       // Từ khóa tìm kiếm
                        }
                    })
                    // Nếu thành công: set kết quả từ API vào state (nếu không có thì để [])
                    .then((res) => setResults(res.data.products || []))
                    // Nếu thất bại: reset về []
                    .catch(() => setResults([]))
                    // Dù thành công hay thất bại đều tắt loading
                    .finally(() => setLoading(false));
            } else {
                // Nếu query rỗng thì reset kết quả
                setResults([]);
            }
        }, 300); // Độ trễ 300ms

        // Cleanup function: hủy setTimeout nếu query thay đổi trước khi hết 300ms
        return () => clearTimeout(delayDebounce);
    }, [query]); // Chạy lại effect mỗi khi query thay đổi

    // Trả về kết quả và trạng thái loading để component khác sử dụng
    return { results, loading };
}
