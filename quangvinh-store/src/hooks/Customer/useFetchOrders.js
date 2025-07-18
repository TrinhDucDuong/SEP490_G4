import { useEffect, useState } from 'react';

export const useFetchOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:9999/order', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch orders');

                const data = await res.json();
                const mappedOrders = mapOrdersFromBackend(data);
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

    const mapOrdersFromBackend = (data) => {
        if (!data.orders) return [];

        return data.orders.map(order => mapSingleOrder(order));
    };

    const mapSingleOrder = (order) => {
        const items = order.orderDetails.map(detail => {
            const product = detail.productVariant.product;
            return {
                name: product.productName,
                image: product.images?.[0] || 'https://via.placeholder.com/60',
                quantity: detail.quantity,
                price: detail.unitPrice
            };
        });

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
            id: order.orderId,
            status: order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
            items,
            total,
            date: order.orderDate?.split('T')[0] ?? ''
        };
    };


    return { orders, loading, error };
};
