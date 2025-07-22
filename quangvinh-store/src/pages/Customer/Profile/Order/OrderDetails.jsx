import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchOrderById } from '../../../../hooks/Customer/Order/useFetchOrderById';

function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { order, loading, error } = useFetchOrderById(orderId);

    if (loading) return <p className="text-center text-gray-600 text-lg">Đang tải...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Lỗi: {error}</p>;
    if (!order) return <p className="text-center text-gray-600 text-lg">Không tìm thấy đơn hàng</p>;

    const isPendingOrProcessing = order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING";

    const handleGoToPayment = () => {
        navigate(`/payment-method`, { state: { order } });
    };

    return (
        <div className="mx-auto p-6 bg-white shadow-lg mt-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{order.orderId}</h2>
                <span className="text-sm text-gray-500"></span>
            </div>

            <div className="mb-6 text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <p>Trạng thái: <strong className="text-blue-600">{order.orderStatus}</strong></p>
                </div>
                <p>Ngày đặt: {order.date}</p>
                <p>Dự kiến giao: {order.estimatedDeliveryDate || 'Đang cập nhật'}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Địa chỉ giao hàng</h4>
                <p className="text-gray-600">{order.shippingAddress?.name} - {order.shippingAddress?.phoneNumber}</p>
                <p className="text-gray-600">{order.shippingAddress?.exactAddress}</p>
            </div>

            <div className="border-t pt-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b last:border-b-0">
                        <div className="flex items-center gap-4">
                            <img src={item.imageUrl || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
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

            {isPendingOrProcessing && (
                <div className="mt-6 text-right">
                    <button
                        onClick={handleGoToPayment}
                        className="px-6 py-2 bg-black border border-black text-white rounded-full font-semibold hover:bg-white hover:text-black transition duration-200"
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            )}
        </div>
    );
}

export default OrderDetail;