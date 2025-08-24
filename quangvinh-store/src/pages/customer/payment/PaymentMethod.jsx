/**
 * @file PaymentMethod.jsx
 * @description Component cho phép người dùng chọn phương thức thanh toán (COD, MOMO, VNPAY).
 * Xử lý logic gọi API để xác nhận thanh toán và hiển thị popup thành công.
 *
 * @copyright 2025 ngothangwork
 * @author ngothang
 */

import React, { useState, useEffect } from "react"; // React core + hooks
import { useLocation, useNavigate } from "react-router-dom"; // Router hooks
import { toast } from "react-toastify"; // Thư viện toast hiển thị thông báo
import Breadcrumb from "../../../components/common/customer/Breadcrumb.jsx"; // Component breadcrumb tái sử dụng
import PaymentSuccessPopup from "./PaymentSuccessPopup.jsx"; // Popup hiển thị khi thanh toán thành công

/**
 * PaymentMethod Component
 * @component
 * @returns {JSX.Element} Giao diện chọn phương thức thanh toán và xử lý thanh toán
 */
const PaymentMethod = () => {
    const location = useLocation(); // Lấy state từ router (order truyền từ trang trước)
    const navigate = useNavigate(); // Dùng để điều hướng
    const [order, setOrder] = useState(location.state?.order || null); // State lưu đơn hàng
    const [selectedMethod, setSelectedMethod] = useState(""); // State lưu phương thức thanh toán người dùng chọn
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API
    const [isSuccess, setIsSuccess] = useState(false); // Trạng thái popup thành công

    /**
     * useEffect: Kiểm tra và load lại đơn hàng nếu không có trong state
     * - Scroll lên đầu trang khi vào component
     * - Nếu không tìm thấy order trong location thì lấy từ localStorage
     * - Nếu không có cả 2 → điều hướng về trang orders
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (!order) {
            const savedOrder = JSON.parse(localStorage.getItem("currentOrder"));
            if (savedOrder) {
                setOrder(savedOrder);
            } else {
                toast.error("Không tìm thấy đơn hàng.");
                navigate("/profile/orders");
            }
        } else {
            localStorage.setItem("currentOrder", JSON.stringify(order));
        }
    }, [order]);

    /**
     * Xử lý thanh toán
     * - Kiểm tra phương thức đã chọn
     * - Gửi request tới backend /order/purchase
     * - Nếu thành công: điều hướng tới VNPAY (nếu chọn), hoặc hiển thị popup
     * - Nếu thất bại: hiển thị toast lỗi
     *
     * @async
     * @function handlePayment
     * @returns {Promise<void>}
     */
    const handlePayment = async () => {
        if (!selectedMethod) {
            toast.warning("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId: Number(order.orderId),
                    paymentMethod: selectedMethod,
                }),
            });

            if (res.ok) {
                const result = await res.json();
                const paymentUrl = result.paymentUrl;

                toast.success("Chọn phương thức thanh toán thành công!");
                localStorage.removeItem("currentOrder");

                if (selectedMethod === "VNPAY" && paymentUrl) {
                    window.location.href = paymentUrl; // Redirect tới VNPay
                    return;
                }
                setIsSuccess(true);
            } else {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                toast.error("Chọn phương thức thanh toán thất bại.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối đến máy chủ.");
        }
    };

    if (loading) return <div className="text-center mt-10">Đang tải đơn hàng...</div>;
    if (!order) return <div className="text-center text-red-500 mt-10">Không tìm thấy đơn hàng.</div>;

    // Các giá trị đơn hàng
    const shipping = order.shippingAddress || {};
    const totalPrice = order.totalPrice || 0;
    const shippingFee = order.shippingFee || 0;
    const discount = order.discount || 0;
    const finalTotal = totalPrice + shippingFee - discount;

    return (
        <div>
            {/* Breadcrumb */}
            <div className="breadcrumb mt-4">
                <Breadcrumb
                    items={[
                        { label: "Trang chủ", to: "/" },
                        { label: "Đơn hàng", to: "/order" },
                        { label: "Thanh toán", to: `/payment` },
                        { label: "Phương thức thanh toán" },
                    ]}
                />
            </div>

            {isSuccess ? (
                // Hiển thị popup thanh toán thành công
                <div className="flex justify-center mt-10">
                    <PaymentSuccessPopup
                        orderId={order?.orderId}
                        paymentTime={new Date().toLocaleString("vi-VN")}
                        reference={"000085752257"}
                        paymentMethod={selectedMethod}
                        sender={shipping.name || "Không rõ"}
                        estimatedDelivery={"25 Th06 - 26 Th06"}
                        total={finalTotal}
                    />
                </div>
            ) : (
                // Giao diện chọn phương thức thanh toán
                <div className="flex flex-row mx-12">
                    <div className="w-full md:w-2/3 p-6 bg-white rounded-md">
                        <h2 className="text-2xl font-semibold mb-4">Chọn phương thức thanh toán</h2>

                        <div className="space-y-3 mb-6 mt-6">
                            {["COD", "MOMO", "VNPAY"].map((method) => (
                                <label key={method} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={selectedMethod === method}
                                        onChange={() => setSelectedMethod(method)}
                                    />
                                    {method === "COD" && "Thanh toán khi nhận hàng (COD)"}
                                    {method === "MOMO" && "Thanh toán qua ví MoMo"}
                                    {method === "VNPAY" && "Thanh toán qua VNPay"}
                                </label>
                            ))}
                        </div>

                        {/* Địa chỉ giao hàng */}
                        <h2 className="text-xl font-semibold mt-6 mb-2">Địa chỉ nhận hàng</h2>
                        <div className="border-2 border-gray-300 p-4 rounded-xl mb-6">
                            <div>Họ và tên: {shipping.name || "Chưa có"}</div>
                            <div>Số điện thoại: {shipping.phoneNumber || "Chưa có"}</div>
                            <div>Địa chỉ: {shipping.exactAddress || "Chưa có"}</div>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full py-2 px-4 bg-black hover:bg-white text-white hover:text-black border border-black rounded-full font-semibold transition"
                        >
                            THANH TOÁN
                        </button>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="w-full md:w-1/3 p-6 bg-white rounded-md">
                        <div className="border border-gray-400 m-2 p-4 border-solid rounded-xl">
                            <h2 className="font-bold mb-4">Tóm Tắt Đơn Hàng</h2>
                            <div className="space-y-1 text-sm">
                                <div>{order.items?.length || 0} sản phẩm</div>
                                <div>Giá gốc: {totalPrice.toLocaleString()}₫</div>
                                <div>Phí giao hàng: {shippingFee.toLocaleString()}₫</div>
                                <div>Giảm giá: {discount.toLocaleString()}₫</div>
                                <div className="font-bold text-lg pt-2">
                                    Tổng cộng: {finalTotal.toLocaleString()}₫
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-400 m-2 p-4 border-solid rounded-xl">
                            {order.items?.map((item) => (
                                <div key={item.id || item.name} className="flex justify-between items-center py-2 border-b">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-semibold text-blue-600">
                                        {(item.price * item.quantity).toLocaleString()}₫
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethod;
