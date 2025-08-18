import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TrackOrderPage() {
    const [orderCode, setOrderCode] = useState("");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    const location = useLocation();

    const getQueryParam = (key) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const handleSearch = async (code) => {
        const searchCode = code || orderCode;
        if (!searchCode.trim()) {
            setError("Vui lòng nhập mã đơn hàng");
            return;
        }
        try {
            const res = await fetch(`http://localhost:9999/order/tracking/${searchCode}`);
            if (!res.ok) throw new Error("order not found");
            const data = await res.json();
            setOrder(data.order);
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

    useEffect(() => {
        const paramCode = getQueryParam("code");
        if (paramCode) {
            setOrderCode(paramCode);
            handleSearch(paramCode);
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex justify-center bg-white px-4 py-16">
            <div className="w-full max-w-3xl space-y-6">
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
                        onClick={() => handleSearch()}
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

                {order && (
                    <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
                        <div>
                            <h2 className="text-lg font-bold">Thông tin đơn hàng</h2>
                            <p><strong>Mã đơn:</strong> {order.orderCode}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                            <p><strong>Trạng thái:</strong> {order.orderStatus}</p>
                            <p><strong>Thanh toán:</strong> {order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                        </div>

                        {order.shippingAddress && (
                            <div>
                                <h2 className="text-lg font-bold">Địa chỉ giao hàng</h2>
                                <p>{order.shippingAddress.name} - {order.shippingAddress.phoneNumber}</p>
                                <p>{order.shippingAddress.exactAddress}</p>
                                <p>{order.shippingAddress.address}</p>
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold mb-2">Sản phẩm</h2>
                            <div className="divide-y">
                                {order.orderDetails.map((od, idx) => {
                                    const p = od.productVariant.product;
                                    return (
                                        <div key={idx} className="flex gap-4 py-4">
                                            <img
                                                src={p.images?.[0]?.imageUrl || "/placeholder.jpg"}
                                                alt={p.productName}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{p.productName}</p>
                                                <p className="text-sm text-gray-500">
                                                    Size: {od.productVariant.productSize} | Màu: {od.color?.colorHex}
                                                </p>
                                                <p className="text-sm">Số lượng: {od.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{od.unitPrice.toLocaleString()}₫</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-lg pt-4 border-t">
                            <span>Tổng cộng</span>
                            <span>{order.totalPrice.toLocaleString()}₫</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
