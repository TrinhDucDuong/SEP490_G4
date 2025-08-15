import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchOrderById } from '../../../../hooks/customer/order/useFetchOrderById';

function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { order, loading, error } = useFetchOrderById(orderId);

    const getStatusLabel = (status) => {
        switch (status) {
            case "PROCESSING": return "Đang xử lý";
            case "SHIPPING": return "Đang giao";
            case "DELIVERED": return "Đã giao";
            case "CANCELED": return "Đã hủy";
            default: return status;
        }
    };

    const handleGoToPayment = () => {
        navigate(`/payment-method`, { state: { order } });
    };

    if (loading) return <p className="text-center text-gray-600 text-lg">Đang tải...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Lỗi: {error}</p>;
    if (!order) return <p className="text-center text-gray-600 text-lg">Không tìm thấy đơn hàng</p>;

    return (
        <div className="mx-auto p-6 bg-white border border-gray-200 mt-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-bold text-black">
                    Chi tiết đơn hàng
                </h2>
                <p>
                    Mã đơn hàng: #{order.orderCode}
                </p>
            </div>

            {/* Owner info */}
            {order.owner && (
                <div className="mb-6 p-4 border border-gray-300 bg-white">
                    <h4 className="font-semibold text-black mb-2">👤 Thông tin người đặt</h4>
                    <p><strong>Tài khoản:</strong> {order.owner.username}</p>
                    {order.owner.email && <p><strong>Email:</strong> {order.owner.email}</p>}
                </div>
            )}

            {/* Status */}
            <div className="mb-6 text-sm text-gray-700 space-y-1">
                <p>Trạng thái:
                    <strong className={
                        order.orderStatus === "PROCESSING" ? "text-yellow-600 ml-1" :
                            order.orderStatus === "SHIPPING" ? "text-blue-600 ml-1" :
                                order.orderStatus === "DELIVERED" ? "text-green-600 ml-1" :
                                    order.orderStatus === "CANCELED" ? "text-red-600 ml-1" :
                                        "ml-1 text-black"
                    }>
                        {getStatusLabel(order.orderStatus)}
                    </strong>
                </p>
                <p>Ngày đặt: {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Không xác định'}</p>
                <p>Dự kiến giao: {order.estimatedDeliveryDate || 'Đang cập nhật'}</p>
                <p>Thanh toán:
                    {order.paymentStatus
                        ? <span className="text-green-600 ml-1">Đã thanh toán</span>
                        : <span className="text-red-600 ml-1">Chưa thanh toán</span>}
                </p>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 p-4 border border-gray-300 bg-white">
                <h4 className="font-semibold text-black mb-2">📦 Địa chỉ giao hàng</h4>
                <p><strong>Người nhận:</strong> {order.shippingAddress?.name}</p>
                <p><strong>Số điện thoại:</strong> {order.shippingAddress?.phoneNumber}</p>
                <p><strong>Loại địa chỉ:</strong> {order.shippingAddress?.type === "HOME" ? "Nhà riêng" : order.shippingAddress?.type}</p>
                <p><strong>Địa chỉ:</strong> {order.shippingAddress?.exactAddress}</p>
                <p><strong>Khu vực:</strong> {order.shippingAddress?.address}</p>
            </div>

            {/* Items */}
            <div className="border-t border-gray-300">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-4">
                            <img
                                src={item.images?.[0] || '/placeholder.jpg'}
                                alt={item.productVariant?.product?.productName}
                                className="w-16 h-16 object-cover"
                            />
                            <div>
                                <p className="font-medium text-black">{item.name}</p>
                                {item.brandName && <p className="text-xs text-gray-500">Thương hiệu: {item.brandName}</p>}
                                {item.categoryName && <p className="text-xs text-gray-500">Danh mục: {item.categoryName}</p>}
                                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                <p className="text-sm text-gray-600">Màu:
                                    <span style={{ backgroundColor: item.colorHex }} className="inline-block w-4 h-4 border ml-1"></span>
                                </p>
                            </div>
                        </div>
                        <p className="font-semibold text-black">
                            {(item.price * item.quantity).toLocaleString()}₫
                        </p>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 text-sm text-gray-700 space-y-2 border-t border-gray-300 pt-4">
                <div className="flex justify-between">
                    <span>Tổng tiền hàng</span>
                    <span>{order.subtotal?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{order.shippingFee?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                    <span>Voucher từ Shop</span>
                    <span className="text-green-600">-{order.voucherDiscount?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between font-bold text-black text-lg pt-4 border-t border-gray-300">
                    <span>Thành tiền</span>
                    <span className="text-red-600">{order.total?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                    <span>Phương thức thanh toán</span>
                    <span>{order.paymentMethod}</span>
                </div>
            </div>

            {/* Payment Button */}
            {
                (order.orderStatus === "PROCESSING" || order.orderStatus == null) &&
                !order.paymentStatus && (
                    <div className="mt-6 text-right">
                        <button
                            onClick={handleGoToPayment}
                            className="px-6 py-2 bg-black text-white border border-black font-semibold hover:bg-white hover:text-black transition duration-200"
                        >
                            Tiến hành thanh toán
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default OrderDetail;
