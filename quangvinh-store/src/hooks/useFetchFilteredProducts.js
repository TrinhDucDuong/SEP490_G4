import { useState, useEffect } from 'react';
import axios from 'axios';

const cleanFilterBody = (options) => {
    const cleaned = { ...options };
    ['category', 'brand', 'color', 'size'].forEach(key => {
        if (cleaned[key] === 'all') delete cleaned[key];
    });

    ['sortBy', 'sortDirection', 'pageNumber', 'pageSize'].forEach(key => {
        delete cleaned[key];
    });

    return cleaned;
};

export const useFetchFilteredProducts = (filterOptions) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const {
                    sortBy = 'createdAt',
                    sortDirection = 'desc',
                    pageNumber = 0,
                    pageSize = 10
                } = filterOptions;
                const filterBody = cleanFilterBody(filterOptions);
                const response = await axios.post(
                    `http://localhost:9999/product?sortBy=${sortBy}&sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
                    filterBody
                );
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
    }, [filterOptions]);

    return { products, loading, error };
};
