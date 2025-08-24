/**
 * OrderItem.jsx
 *
 * Copyright (c) 2025 by ngothangwork
 * Author: ngothangwork
 *
 * Mô tả:
 *  - Component OrderItem hiển thị thông tin tóm tắt của một đơn hàng trong danh sách.
 *  - Bao gồm: mã đơn, ngày đặt, sản phẩm chính, số lượng, trạng thái, thanh toán, tổng tiền.
 *  - Hiển thị các button hành động như: xem chi tiết, thanh toán, đánh giá sản phẩm.
 */

import { useNavigate } from "react-router-dom";

/**
 * Component OrderItem
 * @param {Object} order - Dữ liệu đơn hàng (bao gồm orderId, orderCode, orderDate, orderStatus, items/orderDetails, total, paymentStatus,...)
 */
const OrderItem = ({ order }) => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem("token")); // Kiểm tra user đã đăng nhập hay chưa

    /**
     * Điều hướng sang trang theo dõi đơn hàng công khai
     * (dành cho user chưa đăng nhập, chỉ nhập mã đơn để tra cứu)
     */
    const handlePublicDetailClick = () => {
        navigate(`/track-order/${order.orderId}`);
    };

    /**
     * Điều hướng sang trang chi tiết đơn hàng trong profile cá nhân
     * (dành cho user đã đăng nhập)
     */
    const handlePrivateDetailClick = () => {
        navigate(`/profile/orders/${order.orderId}`);
    };

    /**
     * Điều hướng sang trang phương thức thanh toán
     * (khi đơn hàng đang xử lý nhưng chưa thanh toán)
     */
    const handlePaymentClick = () => {
        navigate(`/payment-method`, { state: { order } });
    };

    /**
     * Điều hướng sang trang đánh giá sản phẩm
     * (khi đơn hàng đã giao thành công)
     */
    const handleReviewClick = () => {
        navigate(`/review`, { state: { order } });
    };

    /**
     * Trả về nhãn trạng thái đơn hàng bằng tiếng Việt
     */
    const getStatusLabel = (status) => {
        switch (status) {
            case "PROCESSING": return "Đang xử lý";
            case "SHIPPING": return "Đang giao";
            case "DELIVERED": return "Đã hoàn thành";
            case "CANCELED": return "Đã hủy";
            default: return status;
        }
    };

    /**
     * Trả về className style tương ứng với trạng thái đơn hàng
     * - màu vàng: đang xử lý
     * - màu xanh dương: đang giao
     * - màu xanh lá: đã giao
     * - màu đỏ: đã hủy
     */
    const getStatusStyle = (status) => {
        switch (status) {
            case "PROCESSING": return "bg-yellow-100 text-yellow-700";
            case "SHIPPING": return "bg-blue-100 text-blue-700";
            case "DELIVERED": return "bg-green-100 text-green-700";
            case "CANCELED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Lấy tên sản phẩm đầu tiên trong đơn
    const firstProductName =
        order.items?.[0]?.name ||
        order.orderDetails?.[0]?.productVariant?.product?.productName ||
        "";

    // Đếm số sản phẩm trong đơn
    const productCount =
        order.items?.length || order.orderDetails?.length || 0;

    return (
        <div className="border border-gray-200 p-4 bg-white shadow-sm hover:bg-gray-100 transition-all duration-500">
            {/* Header thông tin cơ bản */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-700">
                        Mã đơn: <span className="font-semibold">#{order.orderCode}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {firstProductName}{" "}
                        {productCount > 1 && `và ${productCount - 1} sản phẩm khác`}
                    </p>
                    <p className={`text-xs mt-1 ${order.paymentStatus ? "text-green-600" : "text-red-600"}`}>
                        {order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                    </p>
                </div>

                {/* Trạng thái và tổng tiền */}
                <div className="text-right space-y-1">
                    <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${getStatusStyle(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                        {(order.total || order.totalPrice)?.toLocaleString()}₫
                    </p>
                </div>
            </div>

            {/* Các button hành động */}
            <div className="mt-4 flex justify-end gap-4 flex-wrap">
                {/* Xem chi tiết (cho khách chưa đăng nhập) */}
                {!isLoggedIn && (
                    <button
                        onClick={handlePublicDetailClick}
                        className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                    >
                        Xem chi tiết
                    </button>
                )}

                {/* Xem chi tiết (cho user đã đăng nhập) */}
                {isLoggedIn && (
                    <button
                        onClick={handlePrivateDetailClick}
                        className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                    >
                        Xem chi tiết
                    </button>
                )}

                {/* Thanh toán (nếu đơn đang xử lý và chưa thanh toán) */}
                {isLoggedIn && order &&
                    (order.orderStatus === "PROCESSING" || order.orderStatus == null) &&
                    !order.paymentStatus && (
                        // Hiện tại nút thanh toán đang bị ẩn (có thể mở lại khi cần)
                        // <button
                        //     onClick={handlePaymentClick}
                        //     className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                        // >
                        //     Tiến hành thanh toán
                        // </button>
                        <></>
                    )}

                {/* Đánh giá sản phẩm (nếu đơn đã hoàn thành) */}
                {isLoggedIn && order.orderStatus === "DELIVERED" && (
                    <button
                        onClick={handleReviewClick}
                        className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                    >
                        Đánh giá sản phẩm
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderItem;
