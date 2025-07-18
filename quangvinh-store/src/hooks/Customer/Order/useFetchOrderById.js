import { useEffect, useState } from 'react';
import { mapSingleOrder } from '../utils/orderMapper';
import {fetchOrderById} from "../../../utils/api/Customer/OrderAPI.js";

export const useFetchOrderById = (orderId) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                const data = await fetchOrderById(token, orderId);
                setOrder(mapSingleOrder(data.order));
            } catch (err) {
                setError(err.message || 'Lỗi khi lấy đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    return { order, loading, error };
};
