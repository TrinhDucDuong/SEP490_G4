export const fetchBanner = async () => {
    const response = await fetch('http://localhost:9999/banner');
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
};