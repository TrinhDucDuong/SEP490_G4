/**
 * @file PaymentResult.jsx
 * @description Hiển thị kết quả thanh toán thành công, bao gồm thông tin đơn hàng, người nhận, địa chỉ giao hàng và chi tiết sản phẩm.
 * @author
 *   Tác giả: ngothangwork
 * @copyright
 *  2025 ngothangwork.
 */

import React from "react";
import {Link} from "react-router-dom";

/**
 * Component hiển thị kết quả sau khi đặt hàng thành công.
 *
 * @component
 * @param {Object} props - Thuộc tính của component.
 * @param {Object} props.result - Kết quả thanh toán từ backend.
 * @param {Object} props.result.orderOutputData - Dữ liệu đầu ra của đơn hàng.
 * @param {Object} props.result.orderOutputData.order - Thông tin đơn hàng.
 * @param {string} props.result.orderOutputData.order.orderCode - Mã đơn hàng.
 * @param {Date|string} props.result.orderOutputData.order.orderDate - Ngày đặt hàng.
 * @param {string} props.result.orderOutputData.order.orderStatus - Trạng thái đơn hàng (ví dụ: "PAID", "PENDING").
 * @param {number} props.result.orderOutputData.order.totalPrice - Tổng tiền của đơn hàng.
 * @param {Object} props.result.orderOutputData.order.shippingAddress - Thông tin địa chỉ giao hàng.
 * @param {string} props.result.orderOutputData.order.shippingAddress.name - Tên người nhận.
 * @param {string} props.result.orderOutputData.order.shippingAddress.phoneNumber - Số điện thoại người nhận.
 * @param {string} props.result.orderOutputData.order.shippingAddress.address - Địa chỉ giao hàng chi tiết.
 * @param {Array} props.result.orderOutputData.order.orderDetails - Danh sách chi tiết sản phẩm trong đơn hàng.
 * @param {string} [props.result.paymentUrl] - Đường dẫn thanh toán (nếu có).
 *
 * @example
 * const result = {
 *   orderOutputData: {
 *     order: {
 *       orderCode: "ORD123456",
 *       orderDate: "2025-08-24T12:34:56Z",
 *       orderStatus: "PAID",
 *       totalPrice: 200000,
 *       shippingAddress: {
 *         name: "Nguyễn Văn A",
 *         phoneNumber: "0123456789",
 *         address: "123 Đường ABC, Quận 1, TP.HCM"
 *       },
 *       orderDetails: [
 *         {
 *           quantity: 2,
 *           unitPrice: 100000,
 *           productVariant: {
 *             productSize: "L",
 *             color: { colorHex: "#000000" },
 *             product: { productName: "Áo Thun", images: [{ imageUrl: "/shirt.png" }] }
 *           }
 *         }
 *       ]
 *     }
 *   },
 *   paymentUrl: "https://vnpay.vn/payment/..."
 * };
 *
 * <PaymentResult result={result} />
 */
const PaymentResult = ({result}) => {
    const order = result.orderOutputData.order;
    const paymentUrl = result.paymentUrl;

    const statusMap = {
        PAID: "Đã thanh toán",
        PROCESSING: "Đang xử lý",
        SHIPPING: "Đang giao hàng",
        DELIVERED: "Đã giao",
        CANCELED: "Đã hủy",
        PENDING: "Chờ thanh toán"
    };

    console.log(result);

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

            {/* order + Product Info */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* order Info */}
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
                                order.orderStatus === "PAID"
                                    ? "bg-green-500"
                                    : order.orderStatus === "CANCELED"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                            }`}
                        >
                            {statusMap[order.orderStatus] || order.orderStatus}
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
                                src={detail.image.imageUrl || "/fallback.png"}
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
                                        style={{backgroundColor: detail.productVariant.color?.colorHex || "#ccc"}}
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
