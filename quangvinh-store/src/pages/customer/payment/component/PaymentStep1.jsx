import React, { useState } from 'react';

export default function PaymentStep1({ onNext }) {
    const [address, setAddress] = useState('');

    const handleSubmit = () => {
        const orderData = {
            address,
            items: [
            ]
        };
        onNext(orderData);
    };

    return (
        <div>
            <h2>Địa chỉ giao hàng</h2>
            <input
                type="text"
                placeholder="Nhập địa chỉ..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={handleSubmit}>Tiếp tục phương thức thanh toán</button>
        </div>
    );
}
