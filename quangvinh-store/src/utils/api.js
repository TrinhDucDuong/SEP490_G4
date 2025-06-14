export const fetchProducts = async () => {
    const response = await fetch('https://dummyjson.com/products');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return await response.json();
};

export const fetchCategory = async () => {
    const response = await fetch('https://dummyjson.com/products/category-list');
    if (!response.ok) {
        throw new Error('Failed to fetch Category');
    }
    return await response.json();
};