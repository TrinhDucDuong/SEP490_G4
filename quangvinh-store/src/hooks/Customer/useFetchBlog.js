import { useEffect, useState } from "react";

export const useFetchBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Blog');
                }
                const data = await response.json();
                setBlogs(data.blogs || []);
            } catch (err) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { blogs, loading, error };
};


export const fetchBlogById = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Blog');
    }
    return await response.json();
};
