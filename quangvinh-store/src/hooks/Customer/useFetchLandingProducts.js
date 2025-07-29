import { useState, useEffect } from 'react';

export const useFetchLandingProducts = () => {
    const [products, setProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/home`);
                const data = await response.json();
                setProducts(data.products);
                setTopSellingProducts(data.topSellingProducts);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Không thể tải dữ liệu landing page.');
            } finally {
                setLoading(false);
            }
        };

        fetchLandingData();
    }, []);

    return { products, topSellingProducts, loading, error };
};
