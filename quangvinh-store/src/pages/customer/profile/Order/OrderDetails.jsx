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

    const isPendingOrProcessing = order?.orderStatus === "PROCESSING";

    const handleGoToPayment = () => {
        navigate(`/payment-method`, { state: { order } });
    };

    if (loading) return <p className="text-center text-gray-600 text-lg">Đang tải...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Lỗi: {error}</p>;
    if (!order) return <p className="text-center text-gray-600 text-lg">Không tìm thấy đơn hàng</p>;

    return (
        <div className="mx-auto p-6 bg-white shadow-lg mt-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{order.orderId}</h2>
            </div>

            {/* Thông tin chủ đơn hàng */}
            {order.owner && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">👤 Thông tin người đặt</h4>
                    <p><strong>Tài khoản:</strong> {order.owner.username}</p>
                    {order.owner.email && <p><strong>Email:</strong> {order.owner.email}</p>}
                </div>
            )}

            <div className="mb-6 text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <p>Trạng thái: <strong className="text-blue-600">{getStatusLabel(order.orderStatus)}</strong></p>
                </div>
                <p>Ngày đặt: {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Không xác định'}</p>
                <p>Dự kiến giao: {order.estimatedDeliveryDate || 'Đang cập nhật'}</p>
                <p>Thanh toán: {order.paymentStatus ? <span className="text-green-600">Đã thanh toán</span> : <span className="text-red-600">Chưa thanh toán</span>}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">📦 Địa chỉ giao hàng</h4>
                <p><strong>Người nhận:</strong> {order.shippingAddress?.name}</p>
                <p><strong>Số điện thoại:</strong> {order.shippingAddress?.phoneNumber}</p>
                <p><strong>Loại địa chỉ:</strong> {order.shippingAddress?.type === "HOME" ? "Nhà riêng" : order.shippingAddress?.type}</p>
                <p><strong>Địa chỉ:</strong> {order.shippingAddress?.exactAddress}</p>
                <p><strong>Khu vực:</strong> {order.shippingAddress?.address}</p>
            </div>

            <div className="border-t pt-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b last:border-b-0">
                        <div className="flex items-center gap-4">
                            <img src={item.imageUrl || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                {item.brandName && <p className="text-xs text-gray-500">Thương hiệu: {item.brandName}</p>}
                                {item.categoryName && <p className="text-xs text-gray-500">Danh mục: {item.categoryName}</p>}
                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                <p className="text-sm text-gray-500">Màu: <span style={{ backgroundColor: item.colorHex }} className="inline-block w-4 h-4 rounded-full border ml-1"></span></p>
                            </div>
                        </div>
                        <p className="font-semibold text-blue-600">
                            {(item.price * item.quantity).toLocaleString()}₫
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-sm text-gray-600 space-y-2">
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
                <div className="flex justify-between font-bold text-gray-800 text-lg pt-4 border-t">
                    <span>Thành tiền</span>
                    <span className="text-red-600">{order.total?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                    <span>Phương thức thanh toán</span>
                    <span>{order.paymentMethod}</span>
                </div>
            </div>

            {
                (order.orderStatus === "PROCESSING" || order.orderStatus == null) &&
                !order.paymentStatus && (
                    <div className="mt-6 text-right">
                        <button
                            onClick={handleGoToPayment}
                            className="px-6 py-2 bg-black border border-black text-white rounded-full font-semibold hover:bg-white hover:text-black transition duration-200"
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
