import React from 'react';
import { Link } from 'react-router-dom';

function OrderItem({ order }) {
    return (
        <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-500">
                    Mã đơn: <span className="font-medium">#{order.id}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {order.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang xử lý'}
                </div>
            </div>

            {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded border" />
                    <div className="flex-1">
                        <p className="font-medium text-black">{item.name}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right text-blue-600 font-semibold">
                        {(item.price * item.quantity).toLocaleString()}₫
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <span className="text-gray-600 text-sm">Ngày đặt: {order.date}</span>
                <span className="text-black font-bold">
                    Tổng: {order.total.toLocaleString()}₫
                </span>
            </div>

            <div className="flex justify-end mt-4 gap-3">
                <Link
                    to={`/profile/orders/${order.id}`}
                    className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-700 transition"
                >
                    Xem chi tiết
                </Link>
                {order.status !== 'COMPLETED' && (
                    <button
                        className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-100"
                        onClick={() => alert('Yêu cầu hủy đơn')}
                    >
                        Hủy đơn
                    </button>
                )}
            </div>
        </div>
    );
}

export default OrderItem;
