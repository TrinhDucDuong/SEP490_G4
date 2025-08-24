/**
 * @file ProductReviewItem.jsx
 * @description Component hiển thị chi tiết từng sản phẩm trong đơn hàng để người dùng nhập đánh giá.
 * Cho phép chọn mức độ hài lòng (rating), quyết định có giới thiệu sản phẩm hay không,
 * nhập nội dung đánh giá (summary) và gửi feedback về backend.
 *
 * @requires react
 * @requires react-router-dom
 * @requires react-toastify
 * @requires useCreateProductFeedback
 *
 * @component ProductReviewItem
 *
 * @author
 *  - ngothangwork
 * @copyright 2025
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCreateProductFeedback from "../../../hooks/customer/useCreateProductFeedback.js";

/**
 * @component ProductReviewItem
 * @description Component con cho phép người dùng đánh giá một sản phẩm trong đơn hàng.
 *
 * @param {Object} props - Props truyền vào component
 * @param {Object} props.product - Thông tin sản phẩm (ảnh, tên, màu, size, số lượng)
 * @param {number} props.index - Số thứ tự sản phẩm trong danh sách
 * @param {string|number} props.orderId - ID đơn hàng chứa sản phẩm này
 *
 * @returns {JSX.Element} Giao diện đánh giá một sản phẩm
 */
const ProductReviewItem = ({ product, index, orderId }) => {
    // State lưu trữ dữ liệu form đánh giá
    const [rating, setRating] = useState(0); // số sao (1-5)
    const [recommend, setRecommend] = useState(null); // có/không giới thiệu
    const [summary, setSummary] = useState(""); // nội dung đánh giá

    const navigate = useNavigate();
    const { submitFeedback, loading, error } = useCreateProductFeedback();

    /**
     * @function handleSubmit
     * @description Xử lý khi người dùng nhấn "Gửi đánh giá"
     * - Gửi dữ liệu đánh giá về backend thông qua hook `useCreateProductFeedback`
     * - Hiển thị thông báo thành công/thất bại bằng react-toastify
     */
    const handleSubmit = async () => {
        const payload = {
            orderDetailsId: orderId, // 🔥 Có thể cần thay đổi thành product.orderDetailsId nếu backend yêu cầu chi tiết từng item
            comment: summary,
            starRate: rating,
        };

        console.log("Payload gửi backend:", payload);

        try {
            await submitFeedback(payload);
            toast.success("Đánh giá đã được gửi!");
            setTimeout(() => {
                navigate("/profile/order-history");
            }, 1500);
        } catch (err) {
            toast.error(`Lỗi: ${err.message}`);
        }
    };

    console.log("Thông tin sản phẩm:", product);

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="font-semibold mb-2">Sản phẩm {index}</h2>

            {/* Thông tin sản phẩm */}
            <div className="flex gap-4 items-start">
                <img
                    src={product.images?.[0] || "/default.jpg"}
                    alt={product.name}
                    className="w-24 h-24 object-cover"
                />
                <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                        {product.color} | {product.size} | x{product.quantity}
                    </p>
                </div>
            </div>

            {/* Form đánh giá */}
            <div className="mt-4 space-y-4">
                {/* Câu hỏi giới thiệu */}
                <div>
                    <p className="text-sm font-medium">Bạn có sẵn lòng giới thiệu sản phẩm này?</p>
                    <div className="flex gap-4 mt-1">
                        <button
                            onClick={() => setRecommend(true)}
                            className={`px-3 py-1 border rounded ${recommend === true ? "bg-black text-white" : ""}`}
                        >
                            Có
                        </button>
                        <button
                            onClick={() => setRecommend(false)}
                            className={`px-3 py-1 border rounded ${recommend === false ? "bg-black text-white" : ""}`}
                        >
                            Không
                        </button>
                    </div>
                </div>

                {/* Rating (sao) */}
                <div>
                    <p className="text-sm font-medium">Đánh giá chung:</p>
                    <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                className={`cursor-pointer text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                {/* Nội dung đánh giá */}
                <div>
                    <p className="text-sm font-medium">Tóm tắt đánh giá:</p>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Ví dụ: Tôi cực kỳ ưng ý"
                        className="w-full border rounded p-2 mt-1 text-sm"
                        rows={3}
                    />
                </div>

                {/* Lỗi */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    disabled={loading}
                >
                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </div>
        </div>
    );
};

export default ProductReviewItem;
