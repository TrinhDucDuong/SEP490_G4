export const fetchCategory = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
};