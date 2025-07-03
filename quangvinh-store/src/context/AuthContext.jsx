// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { fetchUser } from '../utils/api/UserAPI';

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
                // Dữ liệu trả về dạng { account: {...} }
                if (data.account) {
                    setUser({ ...data.account, token }); // flatten
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

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('guest_cart');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
