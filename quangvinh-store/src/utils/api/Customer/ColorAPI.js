export const fetchColor = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/color`);
    if (!response.ok) {
        throw new Error('Failed to fetch Color');
    }
    return await response.json();
};