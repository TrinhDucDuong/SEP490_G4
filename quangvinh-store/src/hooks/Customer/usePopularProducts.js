import { useState, useEffect } from 'react';
import { fetchProducts } from '../../utils/api/Customer/ProductAPI.js';

export const usePopularProducts = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPopularProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts();
                const popProducts = data.products
                    .filter(product => product.isPopular || product.rating >= 4.5)
                    .slice(0, 4);
                setPopularProducts(popProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getPopularProducts();
    }, []);

    return { popularProducts, loading, error };
};