import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccessPopup = ({
                                 orderId = "Mã đơn",
                                 paymentTime = "dd-mm-yyyy, hh:mm:ss",
                                 reference = "000000000000",
                                 paymentMethod = "Phương thức",
                                 sender = "Người gửi",
                                 estimatedDelivery = "dd ThgX - dd ThgX",
                                 total = 0
                             }) => {
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl text-center text-gray-700">
            <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">Thanh toán thành công</h2>
            <p className="text-sm mb-4">
                Chúng tôi trân trọng sự đồng hành của bạn.<br />
                Chúc bạn luôn mạnh khoẻ và hạnh phúc!
            </p>

            <div className="bg-gray-100 rounded-md px-4 py-2 text-sm font-medium inline-block mb-4">
                #{orderId}
            </div>

            <div className="border-t border-b py-4 text-sm space-y-1 text-left">
                <div className="flex justify-between">
                    <span>Ngày thanh toán:</span>
                    <span>{paymentTime}</span>
                </div>
                <div className="flex justify-between">
                    <span>Số tham chiếu:</span>
                    <span>{reference}</span>
                </div>
                <div className="flex justify-between">
                    <span>Phương thức thanh toán:</span>
                    <span>{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tên người gửi:</span>
                    <span>{sender}</span>
                </div>
                <div className="flex justify-between">
                    <span>Thời gian dự kiến giao hàng:</span>
                    <span>{estimatedDelivery}</span>
                </div>
            </div>

            <div className="text-right mt-4 text-lg font-semibold">
                Tổng đơn hàng: <span className="text-red-500">{total.toLocaleString()}₫</span>
            </div>
        </div>
    );
};

export default PaymentSuccessPopup;
