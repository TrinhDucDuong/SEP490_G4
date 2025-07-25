export const fetchProducts = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products || [];
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data.product;
};
