export const fetchProducts = async () => {
    const response = await fetch('http://localhost:9999/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products || [];
};

export const fetchProductById = async (id) => {
    const response = await fetch(`http://localhost:9999/product/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data.product;
};
