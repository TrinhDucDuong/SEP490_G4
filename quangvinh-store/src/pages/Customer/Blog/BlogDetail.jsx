import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";
import defaultImage from "../../../assets/images/404.jpg";
import { useFetchBlogs } from "../../../hooks/Customer/useFetchBlog.js";
import RecentBlogsSidebar from "./RecentBlogsSidebar.jsx";

function BlogDetail() {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { blogs: allBlogs, loading: loadingBlogs } = useFetchBlogs();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`http://localhost:9999/blog/${blogId}`);
                if (!res.ok) throw new Error("Không thể tải bài viết");
                const data = await res.json();
                setBlog(data.blog);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    // Lọc bài viết gần đây (loại trừ blog hiện tại)
    const recentBlogs = allBlogs
        ?.filter((b) => String(b.blogId) !== String(blogId))
        .slice(0, 5);

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Trang chủ', to: '/' },
                    { label: 'Bài viết', to: '/blogs' },
                    { label: blog?.blogTitle || 'Chi tiết bài viết' },
                ]}
            />

            <div className="container mx-auto px-4 md:px-28 max-w-8xl py-6">
                {loading ? (
                    <p className="text-gray-500">Đang tải bài viết...</p>
                ) : error ? (
                    <p className="text-red-500">Lỗi: {error}</p>
                ) : (
                    blog && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Nội dung bài viết */}
                            <div className="lg:w-2/3">
                                <h1 className="text-3xl font-bold mb-4">{blog.blogTitle}</h1>
                                {blog.createdAt && (
                                    <p className="text-sm text-gray-500 mb-4">
                                        Ngày đăng: {new Date(blog.createdAt).toLocaleDateString()}
                                    </p>
                                )}

                                <img
                                    src={blog.images?.[0]?.imageUrl || defaultImage}
                                    alt={blog.blogTitle || "Ảnh blog"}
                                    className="w-full h-auto rounded-lg mb-6 shadow"
                                />

                                <div className="prose max-w-none">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                        {blog.content || "Không có nội dung."}
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-1/3">
                                {loadingBlogs ? (
                                    <p className="text-gray-500">Đang tải bài viết gần đây...</p>
                                ) : recentBlogs?.length === 0 ? (
                                    <p className="text-gray-500">Không có bài viết nào.</p>
                                ) : (
                                    <RecentBlogsSidebar blogs={recentBlogs} />
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

export default BlogDetail;
