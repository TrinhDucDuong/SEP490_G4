import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategory } from '../utils/api';

export const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts();
                setProducts(data.products);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    return { products, loading, error };
};

export const useFetchCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const data = await fetchCategory();
                setCategories(data);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Không thể tải danh mục. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    return { categories, loading, error };
};