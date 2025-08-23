import { useEffect, useState } from 'react';
import axios from 'axios';

// Hook: Lấy danh sách sản phẩm liên quan theo categoryId hoặc brandId
export const useFetchRelatedProducts = ({ categoryId, brandId, excludeProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]); // danh sách sp liên quan
    const [loading, setLoading] = useState(true); // trạng thái loading
    const [error, setError] = useState(null); // lỗi nếu có

    useEffect(() => {
        // Nếu cả categoryId và brandId đều không có thì không gọi API
        if (!categoryId && !brandId) return;

        const fetchRelated = async () => {
            try {
                // Ưu tiên categoryId, nếu không có thì lấy brandId
                const queryParam = categoryId
                    ? `categoryId=${categoryId}`
                    : `brandId=${brandId}`;

                // Gọi API lấy danh sách sản phẩm
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/product?${queryParam}&pageSize=12`
                );

                // Lấy tất cả sản phẩm trả về
                const allProducts = response.data.products || [];

                // Lọc bỏ sản phẩm hiện tại (excludeProductId)
                const filtered = allProducts.filter(p => p.productId !== excludeProductId);

                setRelatedProducts(filtered);
            } catch (err) {
                setError('Không thể tải sản phẩm liên quan');
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [categoryId, brandId, excludeProductId]);

    return { relatedProducts, loading, error };
};
