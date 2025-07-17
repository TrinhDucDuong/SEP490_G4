import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContextForManager = createContext();

export const useAuthForManager = () => {
    const ctx = useContext(AuthContextForManager);
    if (!ctx) throw new Error('useAuthForManager must be used within AuthProviderForManager');
    return ctx;
};

export const AuthProviderForManager = ({ children }) => {
    /* ---------------- state ---------------- */
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------------- helpers ---------------- */
    const KEY_TOKEN = 'adminAuthToken';
    const KEY_USER = 'adminUserInfo';

    const clearStorage = () => {
        localStorage.removeItem(KEY_TOKEN);
        localStorage.removeItem(KEY_USER);
        sessionStorage.removeItem(KEY_TOKEN);
        sessionStorage.removeItem(KEY_USER);
    };

    const saveCredential = ({ token: tk, account }, remember) => {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(KEY_TOKEN, tk);
        store.setItem(KEY_USER, JSON.stringify(account));
    };

    const readCredential = () =>
        localStorage.getItem(KEY_TOKEN) || sessionStorage.getItem(KEY_TOKEN);

    const tokenValid = () => {
        const tk = readCredential();
        if (!tk) return false;
        try {
            const { exp } = JSON.parse(atob(tk.split('.')[1]));
            return exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };

    /* ---------------- init ---------------- */
    useEffect(() => {
        const tk = readCredential();
        const info = localStorage.getItem(KEY_USER) || sessionStorage.getItem(KEY_USER);

        if (tk && info && tokenValid()) {
            setToken(tk);
            setUser(JSON.parse(info));
        } else {
            clearStorage();
        }
        setLoading(false);
    }, []);

    /* ---------------- actions ---------------- */
    const login = async (username, password, remember = false) => {
        const res = await fetch('http://localhost:9999/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error('Sai tài khoản hoặc mật khẩu');

        const data = await res.json();
        setToken(data.token);
        setUser(data.account);
        saveCredential(data, remember);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        clearStorage();
        window.location.href = '/admin/login';
    };

    // ✅ QUAN TRỌNG: Đây là phần bị thiếu trong code cũ
    const contextValue = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout, // ✅ Export logout function
        clearStorage,
        tokenValid
    };

    return (
        <AuthContextForManager.Provider value={contextValue}>
            {children}
        </AuthContextForManager.Provider>
    );
};
