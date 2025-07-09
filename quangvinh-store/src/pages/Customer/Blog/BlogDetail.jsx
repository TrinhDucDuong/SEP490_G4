import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";

function BlogDetail() {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`http://localhost:9999/blog/${blogId}`);
                if (!res.ok) {
                    throw new Error("Không thể tải bài viết");
                }
                const data = await res.json();
                setBlog(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);

    return (
        <>
            <div>
                <Breadcrumb
                    items={[
                        { label: 'Trang chủ', to: '/' },
                        { label: 'Bài viết', to: '/blogs' },
                        { label: blog?.blogTitle || 'Chi tiết bài viết' },
                    ]}
                />
            </div>

            <div className="container mx-auto p-4 px-28 max-w-4xl">
                {loading && <p className="text-gray-500">Đang tải...</p>}
                {error && <p className="text-red-500">Lỗi: {error}</p>}
                {!loading && !error && blog && (
                    <>
                        <h1 className="text-3xl font-bold mb-4">{blog.blogTitle}</h1>

                        {blog.createdAt && (
                            <p className="text-sm text-gray-500 mb-2">
                                Ngày đăng: {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                        )}

                        {blog.images?.[0] && (
                            <img
                                src={blog.images[0]}
                                alt={blog.blogTitle}
                                className="w-full h-auto rounded-lg mb-6 shadow"
                            />
                        )}

                        <div className="prose max-w-none">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                {blog.content || "Không có nội dung."}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default BlogDetail;
