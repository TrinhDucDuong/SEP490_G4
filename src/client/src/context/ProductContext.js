import { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts } from '../utils/api/Customer/ProductAPI.js';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts();
                const productList = Array.isArray(data) ? data : data.products || [];
                setProducts(productList);
                const popProducts = productList.filter(
                    product => product.isPopular || product.rating >= 4.5
                );
                setPopularProducts(popProducts);
            } catch (err) {
                setError(err.message || "Không thể tải sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, popularProducts, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => useContext(ProductContext);