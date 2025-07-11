export const fetchCategory = async () => {
    const response = await fetch('http://localhost:9999/category');
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
};