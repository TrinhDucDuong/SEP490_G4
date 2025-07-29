import React from "react";
import { useLocation } from "react-router-dom";
import ProductReviewItem from "./ProductReviewItem";

const ProductReviewPage = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <div>Không tìm thấy đơn hàng để đánh giá.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2 text-center">Đánh giá sản phẩm</h1>
            <p className="text-center text-sm text-gray-600 mb-6">Theo đơn hàng: {order.orderId}</p>

            <div className="space-y-8">
                {order.items.map((item, index) => (
                    <ProductReviewItem key={item.productId} product={item} index={index + 1} />
                ))}
            </div>
        </div>
    );
};

export default ProductReviewPage;
