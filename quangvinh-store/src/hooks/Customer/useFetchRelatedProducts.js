import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchRelatedProducts = ({ categoryId, brandId, excludeProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!categoryId && !brandId) return;

        const fetchRelated = async () => {
            try {
                const queryParam = categoryId
                    ? `categoryId=${categoryId}`
                    : `brandId=${brandId}`;

                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product?${queryParam}&pageSize=12`);
                const allProducts = response.data.products || [];

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
