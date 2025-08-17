import React, { useState } from "react";
import { useFetchOrders } from "../../../../hooks/customer/order/useFetchOrders.js";
import OrderItem from "./OrderItem.jsx";

function OrderHistory() {
    const { orders, loading, error } = useFetchOrders();

    console.log(orders);

    const [filterStatus, setFilterStatus] = useState("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const filteredOrders = orders
        .filter(order => {
            if (filterStatus !== "ALL" && order.orderStatus !== filterStatus) return false;

            const orderDate = new Date(order.orderDate);
            if (fromDate && new Date(fromDate) > orderDate) return false;
            if (toDate && new Date(toDate) < orderDate) return false;

            return true;
        })
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    if (loading) return <p className="text-center text-gray-600 text-lg">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Lỗi: {error}</p>;

    return (
        <div className="p-4 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lịch sử đơn hàng</h2>

            {/* filter section */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <select
                    className="border px-3 py-1 rounded text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="SHIPPING">Đang giao</option>
                    <option value="DELIVERED">Đã hoàn thành</option>
                    <option value="CANCELED">Đã hủy</option>
                </select>

                <div className="text-sm flex items-center gap-2">
                    <label>Từ:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="text-sm flex items-center gap-2">
                    <label>Đến:</label>
                    <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            {/* order list */}
            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <OrderItem key={order.orderId} order={order} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 italic">Không có đơn hàng phù hợp.</p>
            )}
        </div>
    );
}

export default OrderHistory;
