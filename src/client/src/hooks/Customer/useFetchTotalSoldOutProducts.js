import { useState, useEffect } from 'react';
import { fetchProducts} from '../../utils/api/Customer/TotalSoldOutProductAPI.js';

export const useFetchTotalSoldOutProducts = () => {
    const [productTotal, setProductTotal] = useState([]);
    const [loadingTotal, setLoadingTotal] = useState(false);
    const [errorTotal, setErrorTotal] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            setLoadingTotal(true);
            try {
                const data = await fetchProducts();
                setProductTotal(data);
            } catch (err) {
                setErrorTotal('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoadingTotal(false);
            }
        };
        getProducts();
    }, []);


    return { productTotal, loadingTotal, errorTotal };
};

