import { useState, useEffect } from 'react';
import { fetchProducts } from '../../utils/api/Customer/ProductAPI.js';

// Custom hook để lấy danh sách sản phẩm từ API
export const useFetchProducts = () => {
    // State lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    // State kiểm soát trạng thái loading (đang tải dữ liệu)
    const [loading, setLoading] = useState(false);
    // State lưu thông báo lỗi nếu có
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm async để gọi API
        const getProducts = async () => {
            setLoading(true); // Bắt đầu tải → bật trạng thái loading
            try {
                const data = await fetchProducts(); // Gọi API lấy sản phẩm
                setProducts(data.products || []);   // Nếu có sản phẩm thì lưu vào state, nếu không thì lưu mảng rỗng
            } catch (err) {
                // Nếu có lỗi, lưu thông báo lỗi vào state
                setError(err.message || 'Không thể tải sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false); // Dù thành công hay thất bại cũng tắt loading
            }
        };
        getProducts(); // Gọi API ngay khi component mount
    }, []); // Chạy 1 lần duy nhất khi component được render lần đầu

    // In ra console để debug danh sách sản phẩm
    console.log('Products:', products);

    // Trả ra dữ liệu và trạng thái cho component sử dụng
    return { products, loading, error };
};
