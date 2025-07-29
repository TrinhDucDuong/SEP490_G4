import { useState, useEffect } from "react";
import axios from "axios";

export default function useSearchProducts(query) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                setLoading(true);
                axios
                    .get(`${import.meta.env.VITE_API_BASE_URL}/product`, {
                        params: {
                            minPrice: 0,
                            sortDirection: 'desc',
                            sortBy: 'createdAt',
                            pageNumber: 0,
                            pageSize: 10,
                            searchText: query
                        }
                    })
                    .then((res) => setResults(res.data.products || []))
                    .catch(() => setResults([]))
                    .finally(() => setLoading(false));
            } else {
                setResults([]);
            }
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return { results, loading };
}
