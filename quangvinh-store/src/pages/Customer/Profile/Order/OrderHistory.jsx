import React from 'react';
import {useFetchOrders} from "../../../../hooks/Customer/useFetchOrders.js";
import OrderItem from "./OrderItem.jsx";


function OrderHistory() {
    const { orders, loading, error } = useFetchOrders();

    const completedOrders = orders.filter(order => order.status === 'COMPLETED');
    const processingOrders = orders.filter(order => order.status !== 'COMPLETED');
    console.log(orders);

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <p className="text-red-500">Lỗi: {error}</p>;

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
