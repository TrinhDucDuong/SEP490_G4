import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaymentSuccessPopup from "./PaymentSuccessPopup";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrder(data.order); // data có thể là { order: {...} }
                } else {
                    console.error("Không thể lấy đơn hàng");
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    if (!order) return <div className="text-center mt-10">Đang tải thông tin đơn hàng...</div>;

    return (
        <div className="flex justify-center mt-10">
            <PaymentSuccessPopup
                orderId={order.orderId}
                paymentTime={new Date(order.orderDate).toLocaleString("vi-VN")}
                reference={`REF-${order.orderId.toString().padStart(6, "0")}`}
                paymentMethod="VNPAY"
                sender={order.owner?.username || "Không rõ"}
                estimatedDelivery="25 Thg08 - 26 Thg08"
                total={order.totalPrice}
                orderDetails={order.orderDetails}
            />
        </div>
    );
};

export default PaymentResult;
