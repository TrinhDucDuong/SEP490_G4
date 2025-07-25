import { createContext, useState, useEffect } from 'react';
import { fetchUser } from '../utils/api/Customer/UserAPI.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const data = await fetchUser(token);
                if (data.account) {
                    setUser({ ...data.account, token });
                } else {
                    setUser(data);
                }
            } catch (err) {
                console.error("Lỗi khi fetch user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, [token]);

    const login = (userData, newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        if (userData.account) {
            setUser({ ...userData.account, token: newToken });
        } else {
            setUser(userData);
        }
    };

    //tạo beiens môi trường
    const logout = async () => {
        try {
            if (token) {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendation/cache`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
            }
        } catch (err) {
            console.error('Lỗi khi gọi recommendation/cache:', err);
        } finally {
            localStorage.removeItem('cart');
            localStorage.removeItem('accountId');
            localStorage.removeItem('token');
            localStorage.removeItem('guest_cart');
            setToken(null);
            setUser(null);
            window.location.href = '/';
        }
    };


    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
