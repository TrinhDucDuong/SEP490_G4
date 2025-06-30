import { useEffect, useState } from 'react';
import { fetchUser } from '../utils/api/UserAPI';

export const useFetchUser = (tokenFromProps) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const token = tokenFromProps || localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setError('Chưa có token');
            setLoading(false);
            return;
        }

        const getUser = async () => {
            try {
                const data = await fetchUser(token);
                setUser(data);
                console.log('User:', data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [token]);

    const login = (updatedUser, newToken) => {
        setUser(updatedUser);
        if (newToken) localStorage.setItem('token', newToken);
    };

    return { user, token, loading, error, login };
};
