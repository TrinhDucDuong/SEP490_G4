import React from "react";
import useFetchFeedback from "../../../hooks/Customer/useFetchFeedback.js";
import FeedbackCard from "./FeedbackCard.jsx";
import RecommendedProducts from "../Common/RecommendedProducts.jsx";

const Feedback = () => {
    const { feedbacks, loading } = useFetchFeedback();

    if (loading) return <p className="text-center py-10">Đang tải phản hồi...</p>;

    return (
        <div className="min-h-screen bg-[#F2F2EE] text-white py-12 px-6">
            <h2 className="text-4xl text-black font-bold text-center mb-4">Feedback</h2>
            <p className="text-center max-w-3xl mx-auto text-black mb-10">
                luôn kiên định với giá trị khác biệt, đó cũng là điều mà khách hàng của chúng tôi tìm kiếm. Chính tinh thần ấy là điểm liên kết tới các nhân vật nổi tiếng - những người tìm đến QuangVinhAuthentic để thể hiện sự khác biệt của chính mình.
            </p>
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {feedbacks.map(fb => (
                        <FeedbackCard
                            key={fb.feedbackId}
                            title={fb.feedbackTitle}
                            content={fb.feedbackContent}
                            images={fb.images}
                        />

                    ))}
                </div>
                <div className="mx-auto mt-10 mb-10 gap-2">
                    <RecommendedProducts/>
                </div>

            </div>


        </div>
    );
};

export default Feedback;
