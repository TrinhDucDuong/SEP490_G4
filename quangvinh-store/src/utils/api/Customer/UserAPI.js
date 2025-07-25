export const fetchUser = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
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
