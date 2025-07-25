export const fetchBrand = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/brand`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
};