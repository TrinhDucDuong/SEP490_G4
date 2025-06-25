import React from "react";

function NewsCard({ news }) {
    const imageUrl = news.image || "https://via.placeholder.com/350x200?text=No+Image";
    return (
        <div className="flex flex-col gap-2 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                    src={imageUrl}
                    alt={news.title || "Ảnh sản phẩm"}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {news.title || "Không có tiêu đề"}
                </h3>
                <p className="text-gray-700 text-sm line-clamp-3">
                    {news.description || "Không có mô tả"}
                </p>
            </div>
        </div>
    );
}

export default NewsCard;