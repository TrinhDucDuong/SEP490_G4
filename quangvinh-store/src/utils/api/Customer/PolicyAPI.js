export const fetchPolicies = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/policy`);
    if (!response.ok) throw new Error('Failed to fetch policies');
    return await response.json();
};
