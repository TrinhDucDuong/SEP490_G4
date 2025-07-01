import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:9999/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20`);
                setProducts(response.data.products || []);
            } catch (err) {
                setError('Lỗi khi tải sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
