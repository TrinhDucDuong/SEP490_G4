import React from "react";
import { Link } from "react-router-dom";

const PaymentResult = ({ result }) => {
    const order = result.orderOutputData.order;
    const paymentUrl = result.paymentUrl;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-4xl font-bold text-green-600">
                    Đặt hàng thành công!
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                    Cảm ơn bạn đã mua hàng tại Quang Vinh Store.
                </p>
            </div>

            {/* Order + Product Info */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Order Info */}
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3 flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2">
                        Thông tin đơn hàng
                    </h2>
                    <p><span className="font-semibold">Mã đơn hàng:</span> {order.orderCode}</p>
                    <p><span className="font-semibold">Ngày đặt:</span> {new Date(order.orderDate).toLocaleString()}</p>
                    <p>
                        <span className="font-semibold">Trạng thái:</span>{" "}
                        <span
                            className={`px-3 py-1 rounded text-white text-sm ${
                                order.orderStatus === "PAID" ? "bg-green-500" : "bg-yellow-500"
                            }`}
                        >
                            {order.orderStatus}
                        </span>
                    </p>
                    <p className="text-lg font-semibold text-red-500">
                        Tổng tiền: {order.totalPrice.toLocaleString()} VND
                    </p>
                    <p><span className="font-semibold">Người nhận:</span> {order.shippingAddress.name}</p>
                    <p><span className="font-semibold">SĐT:</span> {order.shippingAddress.phoneNumber}</p>
                    <p><span className="font-semibold">Địa chỉ:</span> {order.shippingAddress.address}</p>
                </div>

                {/* Product Info */}
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 flex-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2">
                        Sản phẩm
                    </h3>
                    {order.orderDetails.map((detail, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-0">
                            <img
                                src={detail.productVariant.product.images[0]?.imageUrl}
                                alt={detail.productVariant.product.productName}
                                className="w-full sm:w-28 sm:h-28 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-base sm:text-lg">{detail.productVariant.product.productName}</p>
                                <p>Kích cỡ: {detail.productVariant.productSize}</p>
                                <p>
                                    Màu:
                                    <span
                                        className="inline-block w-4 h-4 rounded-full ml-2 border"
                                        style={{ backgroundColor: detail.productVariant.color?.colorHex || "#ccc" }}
                                    ></span>
                                </p>
                                <p>Số lượng: {detail.quantity}</p>
                                <p className="text-red-500 font-medium">
                                    Giá: {detail.unitPrice.toLocaleString()} VND
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <Link
                    to="/"
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition text-sm sm:text-base"
                >
                    Trở về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default PaymentResult;
