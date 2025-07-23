export const fetchInstructions = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/instruction`);
    if (!response.ok) throw new Error('Failed to fetch instructions');
    return await response.json();
};
