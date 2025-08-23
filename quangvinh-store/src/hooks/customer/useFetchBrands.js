import { useEffect, useState } from "react";
import { fetchBrand } from "../../utils/api/Customer/BrandAPI.js";

// Custom hook để lấy danh sách thương hiệu từ API
export const useFetchBrands = () => {
    // State lưu danh sách thương hiệu
    const [brands, setBrands] = useState([]);
    // State quản lý trạng thái đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm bất đồng bộ để gọi API
        const loadBrands = async () => {
            try {
                // Gọi API fetch danh sách thương hiệu
                const data = await fetchBrand();

                // Nếu dữ liệu có "brands" thì gán, không thì để mảng rỗng
                setBrands(data.brands || []);
            } catch (err) {
                // Nếu có lỗi thì gán vào state error
                setError(err.message || "Không thể tải thương hiệu.");
            } finally {
                // Dù thành công hay thất bại cũng set loading = false
                setLoading(false);
            }
        };

        // Gọi hàm loadBrands khi component mount
        loadBrands();
    }, []); // [] => chỉ chạy 1 lần khi component mount

    // Trả về dữ liệu, loading, error để component khác sử dụng
    return { brands, loading, error };
};
