import { useEffect, useState } from 'react';
import {fetchPolicies} from "../../utils/api/Customer/PolicyAPI.js";


export const useFetchPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPolicies();
                setPolicies(data.policies || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { policies, loading, error };
};
