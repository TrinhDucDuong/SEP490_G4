import React, { useState } from 'react';

export default function PaymentStep2({ order, onPay, onBack }) {
    const [method, setMethod] = useState('cod'); // 'cod' hoặc 'vnpay'...

    const handlePayment = () => {
        const paymentData = {
            orderId: order.id,
            method
        };
        onPay(paymentData);
    };

    return (
        <div>
            <h2>Chọn phương thức thanh toán</h2>
            <label>
                <input
                    type="radio"
                    name="method"
                    value="cod"
                    checked={method === 'cod'}
                    onChange={(e) => setMethod(e.target.value)}
                />
                Thanh toán khi nhận hàng
            </label>
            <label>
                <input
                    type="radio"
                    name="method"
                    value="vnpay"
                    checked={method === 'vnpay'}
                    onChange={(e) => setMethod(e.target.value)}
                />
                VNPay
            </label>
            <div>
                <button onClick={onBack}>Quay lại</button>
                <button onClick={handlePayment}>Thanh toán</button>
            </div>
        </div>
    );
}
