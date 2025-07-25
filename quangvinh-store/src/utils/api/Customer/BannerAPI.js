export const fetchBanner = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/banner`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
};