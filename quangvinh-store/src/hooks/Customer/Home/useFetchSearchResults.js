import { useState, useEffect } from 'react';

export default function useFetchSearchResults(searchText) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!searchText) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:9999/product?searchText=${encodeURIComponent(searchText)}&pageNumber=0&pageSize=20&sortDirection=desc&sortBy=createdAt`);
                if (!res.ok) throw new Error('Lỗi khi tìm kiếm sản phẩm');
                const data = await res.json();
                setResults(data.content || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchText]);

    return { results, loading, error };
}
