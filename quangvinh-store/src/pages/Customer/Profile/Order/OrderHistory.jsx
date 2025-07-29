import React, { useState } from "react";
import { useFetchOrders } from "../../../../hooks/Customer/Order/useFetchOrders.js";
import OrderItem from "./OrderItem.jsx";

function OrderHistory() {
    const { orders, loading, error } = useFetchOrders();
    const [activeTab, setActiveTab] = useState("PROCESSING");

    const completedOrders = orders
        .filter(order => order.orderStatus === "DELIVERED")
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const processingOrders = orders
        .filter(order => order.orderStatus !== "DELIVERED")
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    if (loading) return <p className="text-center text-gray-600 text-lg">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Lỗi: {error}</p>;

    return (
        <div className="">
            <div className="bg-white">
                <h2 className="text-2xl font-bold text-gray-900 m-4 sm:mb-0">Đơn hàng</h2>
                <div className="flex mb-2 p-2 border-b border-b-black">

                    <button
                        className={`px-5 py-2 font-medium transition ${
                            activeTab === "PROCESSING"
                                ? "text-black border-b-2 border-black"
                                : "text-gray-700 hover:bg-gray-300 transition-all duration-600"
                        }`}
                        onClick={() => setActiveTab("PROCESSING")}
                    >
                        Đơn đang xử lý
                    </button>
                    <button
                        className={`px-5 py-2 font-medium transition ${
                            activeTab === "DELIVERED"
                                ? "text-black border-b-2 border-black"
                                : "text-gray-700 hover:bg-gray-300 transition-all duration-600"
                        }`}
                        onClick={() => setActiveTab("DELIVERED")}
                    >
                        Đơn đã hoàn thành
                    </button>
                </div>

                {activeTab === "PROCESSING" && (
                    <>
                        {processingOrders.length > 0 ? (
                            <div className="">
                                {processingOrders.map(order => (
                                    <OrderItem key={order.orderId} order={order} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-center py-6">
                                Không có đơn hàng nào đang xử lý.
                            </p>
                        )}
                    </>
                )}

                {activeTab === "DELIVERED" && (
                    <>
                        {completedOrders.length > 0 ? (
                            <div className="">
                                {completedOrders.map(order => (
                                    <OrderItem key={order.orderId} order={order} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-center py-6">
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
