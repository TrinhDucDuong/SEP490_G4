/**
 * @file ProductReviewPage.jsx
 * @description Trang cho phép người dùng đánh giá sản phẩm dựa trên thông tin đơn hàng đã mua.
 * Hiển thị danh sách các sản phẩm trong đơn hàng và render từng item với component `ProductReviewItem`.
 * Người dùng có thể nhập đánh giá và chấm sao cho từng sản phẩm.
 *
 * @requires react
 * @requires react-router-dom
 * @requires ProductReviewItem
 *
 * @component ProductReviewPage
 * @author
 *  - ngothangwork
 * @copyright 2025
 */

import React from "react";
import { useLocation } from "react-router-dom";
import ProductReviewItem from "./ProductReviewItem";

/**
 * @component ProductReviewPage
 * @description Component chính cho trang đánh giá sản phẩm.
 * Lấy dữ liệu đơn hàng từ state của react-router và render danh sách sản phẩm cần đánh giá.
 *
 * @implements useLocation - Hook từ react-router-dom để lấy state (order).
 * @returns {JSX.Element} Giao diện trang đánh giá sản phẩm.
 */
const ProductReviewPage = () => {
    const location = useLocation();
    const order = location.state?.order; // Đơn hàng được truyền từ trang trước

    console.log(order);

    // Nếu không có order thì hiển thị thông báo lỗi
    if (!order) {
        return <div>Không tìm thấy đơn hàng để đánh giá.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2 text-center">Đánh giá sản phẩm</h1>
            <p className="text-center text-sm text-gray-600 mb-6">
                Theo đơn hàng: {order.orderId}
            </p>

            {/* Danh sách sản phẩm cần đánh giá */}
            <div className="space-y-8">
                {order.items.map((item, index) => (
                    <ProductReviewItem
                        key={item.productId}
                        product={item}
                        index={index + 1}
                        orderId={order.orderId}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductReviewPage;
