import React from "react";
import { FaCheckCircle } from "react-icons/fa";

/**
 * Popup hiển thị thông tin khi thanh toán thành công.
 * @author ngothangwork
 * @copyright 2025
 *
 * @component
 * @param {Object} props
 * @param {Object} props.order - Thông tin chi tiết về đơn hàng.
 * @param {number} props.order.orderId - Mã đơn hàng.
 * @param {string|Date} props.order.orderDate - Ngày thanh toán.
 * @param {Object} props.order.owner - Thông tin người đặt hàng.
 * @param {string} [props.order.owner.username] - Tên người đặt hàng.
 * @param {number} props.order.totalPrice - Tổng giá trị đơn hàng.
 * @param {Array<Object>} props.order.orderDetails - Danh sách chi tiết sản phẩm trong đơn hàng.
 * @param {Object} props.order.orderDetails[].productVariant - Biến thể sản phẩm.
 * @param {Object} props.order.orderDetails[].productVariant.product - Thông tin sản phẩm gốc.
 * @param {string} props.order.orderDetails[].productVariant.product.productName - Tên sản phẩm.
 * @param {string} props.order.orderDetails[].productVariant.productSize - Kích thước sản phẩm (ví dụ: "SIZE_M").
 * @param {Object} [props.order.orderDetails[].productVariant.color] - Màu sắc sản phẩm.
 * @param {string} [props.order.orderDetails[].productVariant.color.colorHex] - Mã màu HEX.
 * @param {number} props.order.orderDetails[].quantity - Số lượng sản phẩm.
 * @param {number} props.order.orderDetails[].unitPrice - Giá mỗi đơn vị sản phẩm.
 * @param {Object} [props.order.shippingAddress] - Địa chỉ giao hàng.
 * @param {string} props.order.shippingAddress.exactAddress - Địa chỉ cụ thể.
 * @param {string} props.order.shippingAddress.address - Địa chỉ (phường/xã, quận/huyện, tỉnh/thành phố).
 *
 * @example
 * const order = {
 *   orderId: 123,
 *   orderDate: "2025-08-24T14:30:00",
 *   owner: { username: "nguyenvana" },
 *   totalPrice: 2500000,
 *   orderDetails: [
 *     {
 *       productVariant: {
 *         product: { productName: "Áo thun nam" },
 *         productSize: "SIZE_L",
 *         color: { colorHex: "#000000" }
 *       },
 *       quantity: 2,
 *       unitPrice: 300000
 *     }
 *   ],
 *   shippingAddress: {
 *     exactAddress: "123 Nguyễn Huệ",
 *     address: "Quận 1, TP.HCM"
 *   }
 * };
 *
 * return <PaymentSuccessPopup order={order} />;
 */
const PaymentSuccessPopup = ({ order }) => {
    if (!order) {
        return null;
    }

    console.log(order);

    const {
        orderId,
        orderDate,
        owner,
        totalPrice,
        orderDetails,
        shippingAddress
    } = order;

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
                    <span>{new Date(orderDate).toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                    <span>Số tham chiếu:</span>
                    <span>{`REF-${orderId.toString().padStart(6, "0")}`}</span>
                </div>
                <div className="flex justify-between">
                    <span>Phương thức thanh toán:</span>
                    <span>VNPAY</span>
                </div>
                <div className="flex justify-between">
                    <span>Người đặt:</span>
                    <span>{owner?.username || "Không rõ"}</span>
                </div>

                {shippingAddress && (
                    <div className="flex justify-between">
                        <span>Địa chỉ nhận hàng:</span>
                        <span>{shippingAddress.exactAddress}, {shippingAddress.address}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Thời gian dự kiến giao hàng:</span>
                    <span>25 Thg08 - 26 Thg08</span>
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
                Tổng đơn hàng: <span className="text-red-500">{totalPrice.toLocaleString()}₫</span>
            </div>
        </div>
    );
};

export default PaymentSuccessPopup;
