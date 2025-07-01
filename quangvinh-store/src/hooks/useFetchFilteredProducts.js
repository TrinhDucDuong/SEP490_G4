import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const useFetchFilteredProducts = () => {
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    const queryString = useMemo(() => searchParams.toString(), [searchParams]);

    useEffect(() => {
        const fetchFiltered = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:9999/product?${queryString}`);
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
    }, [queryString]);

    return { products, totalItems, loading, error };
};
