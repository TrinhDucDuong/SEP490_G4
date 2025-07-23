export const fetchOrder = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    return await response.json();
};

export const fetchOrderById = async (token, orderId) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/${orderId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return await response.json();
};









