export const fetchProducts = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product?sortDirection=desc&sortBy=totalSoldOut&pageNumber=0&pageSize=10`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products;
};
