import { useEffect, useState } from 'react';
import { mapSingleOrder } from '../utils/orderMapper';

export const useFetchOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch orders');

                const data = await res.json();
                const mappedOrders = (data.orders || []).map(mapSingleOrder);
                setOrders(mappedOrders);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { orders, loading, error };
};
