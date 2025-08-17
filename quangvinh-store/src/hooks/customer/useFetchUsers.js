import { useEffect, useState } from 'react';
import { fetchUser } from '../../utils/api/Customer/UserAPI.js';

export const useFetchUser = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        const getUser = async () => {
            try {
                const data = await fetchUser(token);
                setUser(data);
            } catch (err) {
                setError(err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [token]);

    const login = (updatedUser, newToken) => {
        console.log(updatedUser);
        console.log(newToken);
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return { user, token, loading, error, login, logout };
};
