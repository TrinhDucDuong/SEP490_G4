import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

const authHeader = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});

export const getAddresses = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/addresses`, authHeader(token));
    return response.data.shippingAddresses;
};

export const createAddress = async (newAddress, token) => {
    const response = await axios.post(`${API_BASE_URL}/addresses`, newAddress, authHeader(token));
    return response.data;
};



