export const fetchColor = async () => {
    const response = await fetch('http://localhost:9999/color');
    if (!response.ok) {
        throw new Error('Failed to fetch Color');
    }
    return await response.json();
};