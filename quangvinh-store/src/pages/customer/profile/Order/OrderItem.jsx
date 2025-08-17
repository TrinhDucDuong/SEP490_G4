import { useNavigate } from "react-router-dom";

const OrderItem = ({ order }) => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem("token"));

    const handlePublicDetailClick = () => {
        navigate(`/track-order/${order.orderId}`);
    };

    const handlePrivateDetailClick = () => {
        navigate(`/profile/orders/${order.orderId}`);
    };

    const handlePaymentClick = () => {
        navigate(`/payment-method`, { state: { order } });
    };

    const handleReviewClick = () => {
        navigate(`/review`, { state: { order } });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "PROCESSING": return "Đang xử lý";
            case "SHIPPING": return "Đang giao";
            case "DELIVERED": return "Đã hoàn thành";
            case "CANCELED": return "Đã hủy";
            default: return status;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "PROCESSING": return "bg-yellow-100 text-yellow-700";
            case "SHIPPING": return "bg-blue-100 text-blue-700";
            case "DELIVERED": return "bg-green-100 text-green-700";
            case "CANCELED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const firstProductName =
        order.items?.[0]?.name ||
        order.orderDetails?.[0]?.productVariant?.product?.productName ||
        "";

    const productCount =
        order.items?.length || order.orderDetails?.length || 0;

    return (
        <div className="border border-gray-200 p-4 bg-white shadow-sm hover:bg-gray-100 transition-all duration-500">
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
                <div className="text-right space-y-1">
                    <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${getStatusStyle(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                        {(order.total || order.totalPrice)?.toLocaleString()}₫
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-4 flex-wrap">
                {!isLoggedIn && (
                    <button
                        onClick={handlePublicDetailClick}
                        className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                    >
                        Xem chi tiết
                    </button>
                )}

                {isLoggedIn && (
                    <button
                        onClick={handlePrivateDetailClick}
                        className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                    >
                        Xem chi tiết
                    </button>
                )}

                {isLoggedIn && order &&
                    (order.orderStatus === "PROCESSING" || order.orderStatus == null) &&
                    !order.paymentStatus && (
                        // <button
                        //     onClick={handlePaymentClick}
                        //     className="text-sm text-black bg-white border border-black px-4 py-1 transition hover:bg-black hover:text-white"
                        // >
                        //     Tiến hành thanh toán
                        // </button>
                        <></>
                    )}

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
