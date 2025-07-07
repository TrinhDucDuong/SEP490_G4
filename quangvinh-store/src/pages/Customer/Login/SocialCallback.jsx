import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {AuthContext} from "../../../context/AuthContext.jsx";

const SocialCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const accountEncoded = searchParams.get('account');

        if (token && accountEncoded) {
            try {
                const account = JSON.parse(decodeURIComponent(accountEncoded));
                localStorage.setItem('accountId', account.accountId);
                login(account, token);
                navigate('/');
            } catch (err) {
                console.error('Lỗi khi xử lý tài khoản:', err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="text-center mt-10 text-lg font-semibold text-gray-800">
            Đang xử lý đăng nhập bằng Google/Facebook...
        </div>
    );
};

export default SocialCallback;
