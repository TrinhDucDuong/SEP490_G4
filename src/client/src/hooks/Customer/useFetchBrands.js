import { useEffect, useState } from "react";
import { fetchBrand } from "../../utils/api/Customer/BrandAPI.js";

export const useFetchBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBrands = async () => {
            try {
                const data = await fetchBrand();
                setBrands(data.brands || []);
            } catch (err) {
                setError(err.message || "Không thể tải thương hiệu.");
            } finally {
                setLoading(false);
            }
        };

        loadBrands();
    }, []);

    return { brands, loading, error };
};
