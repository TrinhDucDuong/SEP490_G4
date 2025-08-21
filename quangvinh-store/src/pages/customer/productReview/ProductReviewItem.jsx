import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCreateProductFeedback from "../../../hooks/customer/useCreateProductFeedback.js";

const ProductReviewItem = ({ product, index, orderId }) => {
    const [rating, setRating] = useState(0);
    const [recommend, setRecommend] = useState(null);
    const [summary, setSummary] = useState("");

    const navigate = useNavigate();
    const { submitFeedback, loading, error } = useCreateProductFeedback();

    const handleSubmit = async () => {
        const payload = {
            orderDetailsId: orderId,
            comment: summary,
            starRate: rating,
        };

        console.log(payload);

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

    console.log(product);

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="font-semibold mb-2">Sản phẩm {index}</h2>
            <div className="flex gap-4 items-start">
                <img src={product.images?.[0]   || "/default.jpg"} alt={product.name} className="w-24 h-24 object-cover" />
                <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.color} | {product.size} | x{product.quantity}</p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <p className="text-sm font-medium">Bạn có sẵn lòng giới thiệu sản phẩm này?</p>
                    <div className="flex gap-4 mt-1">
                        <button
                            onClick={() => setRecommend(true)}
                            className={`px-3 py-1 border rounded ${recommend === true ? 'bg-black text-white' : ''}`}
                        >Có</button>
                        <button
                            onClick={() => setRecommend(false)}
                            className={`px-3 py-1 border rounded ${recommend === false ? 'bg-black text-white' : ''}`}
                        >Không</button>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium">Đánh giá chung:</p>
                    <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                className={`cursor-pointer text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >★</span>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium">Tóm tắt đánh giá:</p>
                    <textarea
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        placeholder="Ví dụ: Tôi cực kỳ ưng ý"
                        className="w-full border rounded p-2 mt-1 text-sm"
                        rows={3}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

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
