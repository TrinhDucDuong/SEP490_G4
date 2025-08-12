import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccessPopup = ({
                                 orderId,
                                 paymentTime,
                                 reference,
                                 paymentMethod,
                                 sender,
                                 estimatedDelivery,
                                 total,
                                 orderDetails = []
                             }) => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl text-gray-700">
            <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">Thanh toán thành công</h2>
            <p className="text-sm mb-4 text-gray-500">
                Chúng tôi trân trọng sự đồng hành của bạn.<br />
                Chúc bạn luôn mạnh khoẻ và hạnh phúc!
            </p>

            <div className="bg-gray-100 rounded-md px-4 py-2 text-sm font-medium inline-block mb-4">
                Mã đơn hàng: #{orderId}
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
                    <span>Người đặt:</span>
                    <span>{sender}</span>
                </div>
                <div className="flex justify-between">
                    <span>Thời gian dự kiến giao hàng:</span>
                    <span>{estimatedDelivery}</span>
                </div>
            </div>

            <div className="mt-6 text-left">
                <h3 className="text-md font-semibold mb-2">Chi tiết sản phẩm</h3>
                <ul className="space-y-3 text-sm">
                    {orderDetails.map((detail, idx) => {
                        const product = detail.productVariant.product;
                        const variant = detail.productVariant;

                        return (
                            <li key={idx} className="border-b pb-2">
                                <div className="font-medium">{product.productName}</div>
                                <div className="text-gray-500">
                                    Size: {variant.productSize.replace("SIZE_", "")} |
                                    Màu: <span className="inline-block w-4 h-4 ml-1 rounded-full" style={{ backgroundColor: variant.color?.colorHex || "#ccc" }}></span>
                                </div>
                                <div>
                                    Số lượng: {detail.quantity} x {detail.unitPrice.toLocaleString()}₫
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="text-right mt-6 text-lg font-semibold">
                Tổng đơn hàng: <span className="text-red-500">{total.toLocaleString()}₫</span>
            </div>
        </div>
    );
};

export default PaymentSuccessPopup;
