import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentMethod = () => {
    const { orderId } = useParams(); // Lấy orderId từ URL
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState("");

    const handlePayment = async () => {
        if (!selectedMethod) {
            toast.warning("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        try {
            const res = await fetch("http://localhost:9999/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: Number(orderId),
                    paymentMethod: selectedMethod,
                }),
            });


            const data = await res.json();
            console.log(data);
            if (res.ok) {
                toast.success("Chọn phương thức thanh toán thành công!");
                navigate("/thank-you"); // hoặc trang xác nhận thanh toán
            } else {
                toast.error("Chọn phương thức thanh toán thất bại.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối đến máy chủ.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-200 rounded-xl shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4">Chọn phương thức thanh toán</h2>

            <div className="space-y-3 mb-6">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={selectedMethod === "CASH"}
                        onChange={() => setSelectedMethod("CASH")}
                    />
                    Thanh toán khi nhận hàng (COD)
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="MOMO"
                        checked={selectedMethod === "MOMO"}
                        onChange={() => setSelectedMethod("MOMO")}
                    />
                    Thanh toán qua ví MoMo
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="ZALOPAY"
                        checked={selectedMethod === "ZALOPAY"}
                        onChange={() => setSelectedMethod("ZALOPAY")}
                    />
                    Thanh toán qua ZaloPay
                </label>
            </div>

            <button
                onClick={handlePayment}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
            >
                THANH TOÁN
            </button>
        </div>
    );
};

export default PaymentMethod;
