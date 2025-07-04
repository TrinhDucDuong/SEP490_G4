import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {AuthContext} from "../context/AuthContext.jsx";


const GoogleRedirect = () => {
    const [searchParams] = useSearchParams();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9999/auth/social/google?${searchParams.toString()}`,
                    {
                        credentials: 'include',
                    }
                );
                const data = await response.json();

                if (response.ok && data.token) {
                    login(data.account, data.token);
                    navigate('/');
                } else {
                    setError(data.message || 'Lỗi đăng nhập');
                }
            } catch (err) {
                setError('Lỗi mạng hoặc máy chủ');
            }
        };

        fetchData();
    }, [searchParams, login, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            {error ? (
                <p className="text-red-500 text-xl">{error}</p>
            ) : (
                <p className="text-lg">Đang đăng nhập bằng Google, vui lòng chờ...</p>
            )}
        </div>
    );
};

export default GoogleRedirect;
