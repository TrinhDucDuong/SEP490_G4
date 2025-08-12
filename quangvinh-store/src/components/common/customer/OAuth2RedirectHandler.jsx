import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {AuthContext} from "../../../context/AuthContext.jsx";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const accountId = searchParams.get('accountId');
        const username = searchParams.get('username');
        localStorage.setItem('token', token);
        localStorage.setItem('accountId', accountId);
        localStorage.setItem('username', username);

        if (token && accountId && username) {
            const userData = {
                accountId: Number(accountId),
                username,
            };
            login({ account: userData }, token);
        }

        window.location.href = '/';
    }, [location, login, navigate]);

    return null;
};

export default OAuth2RedirectHandler;
