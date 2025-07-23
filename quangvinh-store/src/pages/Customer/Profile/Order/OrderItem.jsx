import { useNavigate } from "react-router-dom";

const OrderItem = ({ order }) => {
    const navigate = useNavigate();
    const isCompleted = order.orderStatus === 'DELIVERED';

    const handleDetailClick = () => {
        navigate(`/profile/orders/${order.orderId}`);
    };

    const handlePaymentClick = () => {
        navigate(`/payment-method`, { state: { order } });
    };


    return (
        <div className="border border-gray-200 p-4 bg-white shadow-sm hover:bg-gray-100 transition-all duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-700">
                        Mã đơn: <span className="font-semibold">#{order.orderId}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {order.items[0]?.name} {order.items.length > 1 && `và ${order.items.length - 1} sản phẩm khác`}
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                        isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        {isCompleted ? 'Đã hoàn thành' : 'Đang xử lý'}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                        {order.total.toLocaleString()}₫
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-4">
                <button
                    onClick={handleDetailClick}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Xem chi tiết
                </button>

                {!isCompleted && (
                    <button
                        onClick={handlePaymentClick}
                        className="text-sm text-white bg-orange-400 hover:bg-orange-800 px-4 py-1 rounded-full transition"
                    >
                        Tiến hành thanh toán
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderItem;
