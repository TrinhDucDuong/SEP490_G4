import React from "react";
import { useFetchBlogs } from "../../../hooks/Customer/useFetchBlog.js";
import NewsCard from "./NewsCard.jsx";

function NewsHome() {
    const { blogs, loading, error } = useFetchBlogs();

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">TIN TỨC</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-square">
                    {!loading && !error && blogs.length > 0 && (
                        <NewsCard news={blogs[0]} />
                    )}
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                    {loading && <p>Đang tải...</p>}
                    {error && <p className="text-red-500">Lỗi: {error}</p>}
                    {!loading && !error &&
                        blogs.slice(1, 5).map((blog) => (
                            <div key={blog.blogId} className="aspect-square">
                                <NewsCard news={blog} />
                            </div>
                        ))
                    }
                </div>


            </div>
        </div>
    );
}

export default NewsHome;
