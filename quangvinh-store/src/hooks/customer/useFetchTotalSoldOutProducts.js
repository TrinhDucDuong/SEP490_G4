import { useState, useEffect } from 'react';
import { fetchProducts } from '../../utils/api/Customer/TotalSoldOutProductAPI.js';

// Custom hook để lấy danh sách các sản phẩm bán chạy nhất (Total Sold Out)
export const useFetchTotalSoldOutProducts = () => {
    // State lưu dữ liệu sản phẩm
    const [productTotal, setProductTotal] = useState([]);
    // State kiểm soát trạng thái đang tải dữ liệu
    const [loadingTotal, setLoadingTotal] = useState(false);
    // State lưu thông báo lỗi nếu có
    const [errorTotal, setErrorTotal] = useState(null);

    useEffect(() => {
        // Hàm bất đồng bộ để fetch dữ liệu sản phẩm từ API
        const getProducts = async () => {
            setLoadingTotal(true); // Bắt đầu loading
            try {
                // Gọi API để lấy sản phẩm
                const data = await fetchProducts();
                setProductTotal(data); // Lưu dữ liệu vào state
            } catch (err) {
                // Nếu có lỗi => set message lỗi
                setErrorTotal('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoadingTotal(false); // Dù thành công hay thất bại => tắt loading
            }
        };
        getProducts(); // Gọi hàm fetch
    }, []); // Chỉ chạy 1 lần khi component mount

    // Trả về dữ liệu, trạng thái loading và error để component sử dụng
    return { productTotal, loadingTotal, errorTotal };
};
