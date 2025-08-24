/**
 * @file Feedback.jsx
 * @description Component hiển thị danh sách phản hồi khách hàng và gợi ý sản phẩm liên quan.
 * @author ngothangwork
 * @copyright 2025 ngothangwork
 */

import React from "react";
import useFetchFeedback from "../../../hooks/customer/useFetchFeedback.js";
import FeedbackCard from "./FeedbackCard.jsx";
import RecommendedProducts from "../common/RecommendedProducts.jsx";

/**
 * Component Feedback
 * Hiển thị:
 * - Tiêu đề Feedback Khách Hàng
 * - Mô tả ngắn về tinh thần khách hàng
 * - Danh sách FeedbackCard (hình ảnh + tiêu đề)
 * - Gợi ý sản phẩm dành riêng cho người dùng
 *
 * @component
 * @example
 * return (
 *   <Feedback />
 * )
 */
const Feedback = () => {
    const { feedbacks, loading } = useFetchFeedback();

    if (loading) return <p className="text-center py-10">Đang tải phản hồi...</p>;

    return (
        <div className="min-h-screen py-16 px-6 lg:px-20">
            <h2 className="text-4xl text-black font-bold text-center mb-4 tracking-wide uppercase">
                Feedback Khách Hàng
            </h2>
            <p className="text-center max-w-3xl mx-auto text-gray-700 mb-12 text-lg">
                Luôn kiên định với giá trị khác biệt – điều mà khách hàng của chúng tôi tìm kiếm.
                Chính tinh thần ấy đã gắn kết QuangVinhAuthentic với nhiều nhân vật nổi tiếng,
                những người chọn chúng tôi để thể hiện sự khác biệt của chính mình.
            </p>

            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {feedbacks.map((fb) => (
                        <FeedbackCard
                            key={fb.feedbackId}
                            title={fb.feedbackTitle}
                            content={fb.feedbackContent}
                            images={fb.images}
                        />
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <div className="w-full max-w-6xl">
                        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                            Gợi ý dành riêng cho bạn
                        </h3>
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <RecommendedProducts />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
