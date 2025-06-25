export const fetchProducts = async () => {
    const response = await fetch('http://localhost:9999/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=10', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({})
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products;
};
