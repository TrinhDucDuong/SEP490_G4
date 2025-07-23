import React from "react";
import { Link } from "react-router-dom";
import defaultImage from "../../../assets/images/404.jpg";

function NewsCard({ news = {} }) {
    const imageUrl = Array.isArray(news.images) && news.images.length > 0
        ? news.images[0].imageUrl
        : "https://via.placeholder.com/600x400?text=No+Image";

    const title = news.blogTitle || "Không có tiêu đề";
    const blogUrl = news.blogId ? `/blog/${news.blogId}` : "#";

    return (
        <Link to={blogUrl}>
            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition aspect-square flex flex-col">
                <div className="flex-grow overflow-hidden">
                    <img
                        src={imageUrl || defaultImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                </div>
                <div className="p-3 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-black line-clamp-2">
                        {title}
                    </h3>
                    <div
                        className="prose max-w-none text-gray-600 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    ></div>
                </div>
            </div>
        </Link>
    );
}

export default NewsCard;
