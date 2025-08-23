import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook: Lấy danh sách sản phẩm (20 sản phẩm mới nhất theo createdAt giảm dần)
export const useFetchProducts = () => {
    // State lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    // State quản lý trạng thái loading
    const [loading, setLoading] = useState(true);
    // State lưu lỗi nếu có
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // bật loading khi bắt đầu fetch
            try {
                // Gọi API lấy danh sách sản phẩm
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20`
                );

                // Lưu danh sách sản phẩm, nếu không có thì để mảng rỗng
                setProducts(response.data.products || []);
            } catch (err) {
                // Nếu lỗi, lưu message lỗi
                setError('Lỗi khi tải sản phẩm.');
            } finally {
                // Tắt loading sau khi xong
                setLoading(false);
            }
        };

        // Gọi API khi component mount
        fetchProducts();
    }, []);

    // Trả dữ liệu ra cho component khác dùng
    return { products, loading, error };
};


// Hook: Lấy chi tiết sản phẩm theo productId
export const useFetchProductById = (productId) => {
    // State lưu chi tiết 1 sản phẩm
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu không có productId thì không gọi API
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true); // bật loading khi fetch
            try {
                // Gọi API lấy chi tiết sản phẩm theo ID
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/${productId}`);

                // Lưu sản phẩm vào state (nếu không có thì để null)
                setProduct(response.data.product || null);
            } catch (err) {
                // Nếu lỗi, set thông báo lỗi
                setError('Lỗi khi tải chi tiết sản phẩm.');
                console.error(err);
            } finally {
                // Tắt loading sau khi xong
                setLoading(false);
            }
        };

        // Gọi API khi productId thay đổi
        fetchProduct();
    }, [productId]);

    // Trả dữ liệu ra cho component khác dùng
    return { product, loading, error };
};
