import React, { useState } from "react";
import { useFetchOrders } from "../../../../hooks/Customer/Order/useFetchOrders.js";
import OrderItem from "./OrderItem.jsx";

function OrderHistory() {
    const { orders, loading, error } = useFetchOrders();
    const [activeTab, setActiveTab] = useState("PROCESSING");

    const completedOrders = orders
        .filter(order => order.orderStatus === "COMPLETED")
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const processingOrders = orders
        .filter(order => order.orderStatus !== "COMPLETED")
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    if (loading) return <p className="text-center text-gray-600 text-lg">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Lỗi: {error}</p>;

    return (
        <div className="">
            <div className="bg-white">
                <div className="flex mb-2 p-2 border-b border-b-black">
                    <button
                        className={`px-5 py-2 font-medium transition ${
                            activeTab === "PROCESSING"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-600"
                        }`}
                        onClick={() => setActiveTab("PROCESSING")}
                    >
                        Đơn đang xử lý
                    </button>
                    <button
                        className={`px-5 py-2 font-medium transition ${
                            activeTab === "COMPLETED"
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-600"
                        }`}
                        onClick={() => setActiveTab("COMPLETED")}
                    >
                        Đơn đã hoàn thành
                    </button>
                </div>

                {activeTab === "PROCESSING" && (
                    <>
                        {processingOrders.length > 0 ? (
                            <div className="space-y-2">
                                {processingOrders.map(order => (
                                    <OrderItem key={order.orderId} order={order} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-center py-6 bg-green-300 rounded-lg shadow-sm">
                                Không có đơn hàng nào đang xử lý.
                            </p>
                        )}
                    </>
                )}

                {activeTab === "COMPLETED" && (
                    <>
                        {completedOrders.length > 0 ? (
                            <div className="space-y-6">
                                {completedOrders.map(order => (
                                    <OrderItem key={order.orderId} order={order} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-center py-6 bg-green-300 rounded-lg shadow-sm">
                                Chưa có đơn hàng hoàn thành.
                            </p>
                        )}
                    </>
                )}
            </div>


        </div>
    );
}

export default OrderHistory;
