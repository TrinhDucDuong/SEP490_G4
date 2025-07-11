export const fetchPolicies = async () => {
    const response = await fetch('http://localhost:9999/policy');
    if (!response.ok) throw new Error('Failed to fetch policies');
    return await response.json();
};
