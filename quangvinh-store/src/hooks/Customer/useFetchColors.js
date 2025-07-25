import { useEffect, useState } from "react";

export function useFetchColors() {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/color`);
                if (!res.ok) throw new Error("Failed to fetch colors");
                const data = await res.json();
                setColors(data.colorHex || []);
            } catch (err) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchColors();
    }, []);

    return { colors, loading, error };
}
