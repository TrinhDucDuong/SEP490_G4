/**
 * @file TrackOrderPage.jsx
 * @description Trang cho phép người dùng nhập mã đơn hàng để tra cứu tình trạng đơn hàng,
 * bao gồm thông tin sản phẩm, thanh toán và địa chỉ giao hàng.
 * @author
 *  - ngothangwork
 * @copyright 2025
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @component TrackOrderPage
 * @description Component hiển thị giao diện tìm kiếm và kết quả chi tiết đơn hàng.
 *
 * @implements useState - Quản lý state cho orderCode, order, error.
 * @implements useLocation - Lấy query param từ URL (?code=...).
 * @implements useEffect - Kiểm tra param "code" trong URL và tự động fetch đơn hàng.
 */
export default function TrackOrderPage() {
    const [orderCode, setOrderCode] = useState("");   // Mã đơn hàng nhập vào
    const [order, setOrder] = useState(null);         // Thông tin đơn hàng trả về từ backend
    const [error, setError] = useState(null);         // Thông báo lỗi nếu có

    const statusMap = {
        PAID: "Đã thanh toán",
        PROCESSING: "Đang xử lý",
        SHIPPING: "Đang giao hàng",
        DELIVERED: "Đã giao",
        CANCELED: "Đã hủy",
        PENDING: "Chờ thanh toán"
    };

    const location = useLocation();

    /**
     * @function getQueryParam
     * @description Lấy giá trị query param từ URL.
     * @param {string} key - Tên param cần lấy.
     * @returns {string|null} Giá trị param hoặc null nếu không tồn tại.
     */
    const getQueryParam = (key) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    /**
     * @function handleSearch
     * @description Gọi API tìm kiếm đơn hàng theo orderCode.
     * @param {string} code - Mã đơn hàng (nếu không truyền thì lấy từ state orderCode).
     * @async
     */
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

    /**
     * @function handleInputChange
     * @description Xử lý khi người dùng nhập mã đơn hàng vào input.
     * @param {object} e - Sự kiện thay đổi input.
     */
    const handleInputChange = (e) => {
        setOrderCode(e.target.value);
        setError(null);
    };

    /**
     * @effect
     * @description Khi URL có param "code" thì tự động gọi API tìm đơn hàng.
     */
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

                {/* Ô nhập mã đơn hàng */}
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

                {/* Thông báo lỗi */}
                {error && (
                    <div className="text-sm text-center text-red-600 font-medium">
                        {error}
                    </div>
                )}

                {/* Hiển thị thông tin đơn hàng nếu có */}
                {order && (
                    <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
                        <div>
                            <h2 className="text-lg font-bold">Thông tin đơn hàng</h2>
                            <p><strong>Mã đơn:</strong> {order.orderCode}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                <span
                                    className={`px-3 py-1 rounded text-white text-sm ${
                                        order.orderStatus === "PAID"
                                            ? "bg-green-500"
                                            : order.orderStatus === "CANCELED"
                                                ? "bg-red-500"
                                                : order.orderStatus === "DELIVERED"
                                                    ? "bg-blue-500"
                                                    : "bg-yellow-500"
                                    }`}
                                >
                                    {statusMap[order.orderStatus] || order.orderStatus}
                                </span>
                            </p>

                            <p><strong>Thanh toán:</strong> {order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                        </div>

                        {/* Địa chỉ giao hàng */}
                        {order.shippingAddress && (
                            <div>
                                <h2 className="text-lg font-bold">Địa chỉ giao hàng</h2>
                                <p>{order.shippingAddress.name} - {order.shippingAddress.phoneNumber}</p>
                                <p>{order.shippingAddress.exactAddress}</p>
                                <p>{order.shippingAddress.address}</p>
                            </div>
                        )}

                        {/* Danh sách sản phẩm */}
                        <div>
                            <h2 className="text-lg font-bold mb-2">Sản phẩm</h2>
                            <div className="divide-y">
                                {order.orderDetails.map((od, idx) => {
                                    const p = od.productVariant.product;
                                    return (
                                        <div key={idx} className="flex gap-4 py-4">
                                            <img
                                                src={od.image.imageUrl || "/placeholder.jpg"}
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

                        {/* Tổng tiền */}
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
