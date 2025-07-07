import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const OAuth2Redirect = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = params.get('token');
        const accountId = params.get('accountId');
        const email = params.get('email');
        const name = params.get('name');

        if (token && accountId) {
            localStorage.setItem('accountId', accountId);
            login({ accountId, email, name }, token);
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return <p>Đang xác thực Google...</p>;
};

export default OAuth2Redirect;
