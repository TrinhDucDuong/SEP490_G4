import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAddresses } from "../utils/api/AddressAPI.js";

const useFetchAddress = () => {
    const { token } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAddresses = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getAddresses(token);
            setAddresses(data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [token]);

    return { addresses, loading, error, refetch: fetchAddresses };
};

export default useFetchAddress;
