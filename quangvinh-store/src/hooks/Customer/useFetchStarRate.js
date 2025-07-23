import { useEffect, useState } from "react";

export const useFetchStarRate = (productId, filterStar = '', pageNumber = 0, pageSize = 3) => {
    const [starRates, setStarRates] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams({
                    productId,
                    pageNumber,
                    pageSize,
                });

                // Chỉ thêm numberOfStarRate nếu filterStar khác ''
                if (filterStar !== '') {
                    params.append('numberOfStarRate', filterStar);
                }

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/star-rate?${params.toString()}`);
                const data = await res.json();

                setStarRates(data.starRate || []);
                setTotalCount(data.totalElements || 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId, filterStar, pageNumber, pageSize]);

    return { starRates, totalCount, loading, error };
};
