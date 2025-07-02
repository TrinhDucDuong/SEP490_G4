import React, { useEffect, useState } from 'react';
import OrderItem from "./OrderItem.jsx";


function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fakeOrders = [
            {
                id: 1,
                status: 'COMPLETED',
                items: [
                    {
                        name: 'ADIDAS 4DFWD X PARLEY',
                        image: 'https://via.placeholder.com/60',
                        quantity: 1,
                        price: 1250000,
                    },
                ],
                total: 1250000,
                date: '2025-06-29',
            },
            {
                id: 2,
                status: 'PENDING',
                items: [
                    {
                        name: 'Nike Air Max',
                        image: 'https://via.placeholder.com/60',
                        quantity: 2,
                        price: 2000000,
                    },
                ],
                total: 4000000,
                date: '2025-06-30',
            },
        ];

        setOrders(fakeOrders);
    }, []);

    const completedOrders = orders.filter(order => order.status === 'COMPLETED');
    const processingOrders = orders.filter(order => order.status !== 'COMPLETED');

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Lịch sử đơn hàng</h2>

            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Đơn hàng đang xử lý</h3>
                {processingOrders.length > 0 ? (
                    processingOrders.map(order => (
                        <OrderItem key={order.id} order={order} />
                    ))
                ) : (
                    <p className="text-gray-500 italic">Không có đơn hàng nào đang xử lý.</p>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Đơn hàng đã hoàn thành</h3>
                {completedOrders.length > 0 ? (
                    completedOrders.map(order => (
                        <OrderItem key={order.id} order={order} />
                    ))
                ) : (
                    <p className="text-gray-500 italic">Chưa có đơn hàng hoàn thành.</p>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;
