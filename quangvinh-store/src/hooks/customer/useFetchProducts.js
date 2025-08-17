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
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20`);
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

export const useFetchProductById = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:9999/product/${productId}`);
                setProduct(response.data.product || null);
            } catch (err) {
                setError('Lỗi khi tải chi tiết sản phẩm.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
};

