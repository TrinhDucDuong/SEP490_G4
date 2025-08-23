import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const useFetchFilteredProducts = () => {
    // State lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    // State lưu tổng số sản phẩm (phục vụ phân trang)
    const [totalItems, setTotalItems] = useState(0);
    // State loading để hiển thị spinner khi đang tải
    const [loading, setLoading] = useState(true);
    // State quản lý lỗi
    const [error, setError] = useState(null);

    // Lấy query params từ URL (vd: ?category=shoes&page=2)
    const [searchParams] = useSearchParams();

    // Tối ưu hóa: chỉ tính lại query string khi searchParams thay đổi
    const queryString = useMemo(() => searchParams.toString(), [searchParams]);

    useEffect(() => {
        const fetchFiltered = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API với query string (lọc sản phẩm theo URL params)
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/product?${queryString}`
                );

                // Nếu API có data thì set vào state, ngược lại để mảng rỗng
                setProducts(response.data.products || []);
                setTotalItems(response.data.totalItems || 0);
            } catch (err) {
                console.error('Lỗi API:', err);
                setError('Lỗi khi lọc sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchFiltered();
    }, [queryString]); // Mỗi lần queryString thay đổi thì gọi lại API

    return { products, totalItems, loading, error };
};
