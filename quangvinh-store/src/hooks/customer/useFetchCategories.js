import { useEffect, useState } from "react";
import { fetchCategory } from "../../utils/api/Customer/CatgoryAPI.js";

// Custom hook để lấy danh mục sản phẩm từ API
export const useFetchCategories = () => {
    // State lưu danh sách danh mục
    const [categories, setCategories] = useState([]);
    // State quản lý trạng thái loading
    const [loading, setLoading] = useState(false);
    // State lưu thông tin lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm bất đồng bộ để gọi API lấy danh mục
        const getCategories = async () => {
            setLoading(true); // bật trạng thái loading
            try {
                // Gọi API
                const data = await fetchCategory();

                // Nếu API trả về có chứa categoryList thì set vào state
                if (data?.categoryList) {
                    setCategories(data.categoryList);
                } else {
                    // Nếu không có dữ liệu danh mục
                    setError('Không có danh mục nào được trả về.');
                }
            } catch (err) {
                // Bắt lỗi nếu API fail
                setError('Không thể tải danh mục. Vui lòng thử lại sau.');
            } finally {
                // Tắt loading dù thành công hay thất bại
                setLoading(false);
            }
        };

        // Gọi hàm lấy dữ liệu khi component mount
        getCategories();
    }, []); // chỉ chạy 1 lần khi component mount

    // Trả về dữ liệu, loading và error để component có thể dùng
    return { categories, loading, error };
};
