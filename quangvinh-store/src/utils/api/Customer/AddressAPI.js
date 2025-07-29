import axios from 'axios';

const authHeader = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});

export const getAddresses = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/addresses`, authHeader(token));
    return response.data.shippingAddresses;
};

export const createAddress = async (newAddress, token) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/addresses`, newAddress, authHeader(token));
    return response.data;
};



