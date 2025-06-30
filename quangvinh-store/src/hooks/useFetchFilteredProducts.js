import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const useFetchFilteredProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const query = searchParams.toString();
                const response = await axios.get(`http://localhost:9999/product?${query}`);
                setProducts(response.data.products || []);
                setError(null);
            } catch (err) {
                console.error('Lỗi gọi API:', err);
                setError('Lỗi khi gọi API lọc sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    return { products, loading, error };
};
