export const fetchInstructions = async () => {
    const response = await fetch('http://localhost:9999/instruction');
    if (!response.ok) throw new Error('Failed to fetch instructions');
    return await response.json();
};
