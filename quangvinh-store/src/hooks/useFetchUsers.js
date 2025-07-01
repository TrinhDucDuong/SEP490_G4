import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useFetchUser = () => {
    const { user, token, logout } = useContext(AuthContext);

    return {
        user,
        token,
        logout,
        loading: false,
        error: null,
    };
};
