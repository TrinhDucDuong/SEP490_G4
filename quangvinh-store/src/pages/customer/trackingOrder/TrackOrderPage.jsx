import { useState } from "react";
import OrderItem from "../profile/Order/OrderItem.jsx";

export default function TrackOrderPage() {
    const [orderCode, setOrderCode] = useState("");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!orderCode.trim()) {
            setError("Vui lòng nhập mã đơn hàng");
            return;
        }
        try {
            const res = await fetch(`http://localhost:9999/order/tracking/${orderCode}`);
            if (!res.ok) throw new Error("order not found");
            const data = await res.json();
            setOrder({
                ...data.order,
                items: data.order.orderDetails.map(od => ({
                    name: od.productVariant.product.productName
                })),
                total: data.order.totalPrice
            });

            setError(null);
        } catch (err) {
            setOrder(null);
            setError("Không tìm thấy đơn hàng với mã bạn nhập.");
        }
    };



    const handleInputChange = (e) => {
        setOrderCode(e.target.value);
        setError(null);
    };

    return (
        <div className="min-h-screen flex justify-center bg-white px-4 py-16">
            <div className="w-full max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold text-center text-black">Tra cứu đơn hàng</h1>
                <p className="text-sm text-center text-gray-500">
                    Vui lòng nhập mã đơn hàng để kiểm tra tình trạng
                </p>

                <div className="flex border border-black rounded-full overflow-hidden">
                    <input
                        type="text"
                        value={orderCode}
                        onChange={handleInputChange}
                        placeholder="Nhập mã đơn hàng..."
                        className="flex-1 px-4 py-2 focus:outline-none text-black"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-black text-white px-6 py-2 hover:bg-white hover:text-black border-l border-black transition-all"
                    >
                        Tìm đơn
                    </button>
                </div>

                {error && (
                    <div className="text-sm text-center text-red-600 font-medium">
                        {error}
                    </div>
                )}

                {order && <OrderItem order={order} />}
            </div>
        </div>
    );
}
