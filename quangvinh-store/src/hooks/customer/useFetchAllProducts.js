import { useState, useEffect } from 'react';
import { fetchProducts } from '../../utils/api/Customer/ProductAPI.js';

export const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts();
                setProducts(data.products || []);
            } catch (err) {
                setError(err.message || 'Không thể tải sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    console.log('Products:', products);
    return { products, loading, error };
};

