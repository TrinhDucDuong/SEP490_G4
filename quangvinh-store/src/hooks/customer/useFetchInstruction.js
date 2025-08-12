import { useEffect, useState } from 'react';
import { fetchInstructions } from '../../utils/api/Customer/InstructionAPI.js';

export const useFetchInstruction = () => {
    const [instructions, setInstructions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchInstructions();
                setInstructions(data.instructions || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { instructions, loading, error };
};
