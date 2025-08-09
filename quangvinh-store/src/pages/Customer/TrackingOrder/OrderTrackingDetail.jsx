import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const getStatusLabel = (status) => {
    switch (status) {
        case "PROCESSING": return "Đang xử lý";
        case "SHIPPING": return "Đang giao";
        case "DELIVERED": return "Đã giao";
        case "CANCELED": return "Đã hủy";
        default: return status;
    }
};

export default function OrderTrackingDetail() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://localhost:9999/order/tracking/${orderId}`);
                if (!res.ok) throw new Error("Order not found");
                const data = await res.json();
                setOrder(data.order);
            } catch (err) {
                setError("Không tìm thấy đơn hàng hoặc đã xảy ra lỗi.");
            }
        };
        fetchOrder();
    }, [orderId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN");
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{order.orderId}</h2>
            <div className="flex items-center gap-4 mb-4">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {getStatusLabel(order.orderStatus)}
                </span>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                Ngày đặt: {formatDate(order.orderDate)}
            </p>

            <div className="space-y-4">
                {order.orderDetails.map((detail, index) => {
                    const product = detail.productVariant.product;
                    return (
                        <div
                            key={index}
                            className="flex items-start gap-4 border-b pb-4"
                        >
                            <img
                                src={
                                    product.images?.[0]?.imageUrl ||
                                    "https://via.placeholder.com/100"
                                }
                                alt={product.productName}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-lg">{product.productName}</h4>
                                <p className="text-sm text-gray-500">
                                    Thương hiệu: {product.brand.brandName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Kích cỡ: {detail.productVariant.productSize}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center">
                                    Màu:
                                    <span
                                        style={{
                                            backgroundColor:
                                                detail.productVariant.color?.colorHex || "#ccc",
                                        }}
                                        className="inline-block w-4 h-4 rounded-full ml-2"
                                    ></span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Số lượng: {detail.quantity}
                                </p>
                            </div>
                            <div className="text-right font-semibold text-gray-800">
                                {detail.unitPrice.toLocaleString("vi-VN")} ₫
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex justify-between font-semibold text-lg">
                <span>Tổng tiền:</span>
                <span>{order.totalPrice.toLocaleString("vi-VN")} ₫</span>
            </div>

            <div className="mt-6">
                <h4 className="font-semibold mb-2">Địa chỉ giao hàng</h4>
                <p className="text-gray-600">
                    {order.shippingAddress || "Chưa có địa chỉ"}
                </p>
            </div>
        </div>
    );
}
