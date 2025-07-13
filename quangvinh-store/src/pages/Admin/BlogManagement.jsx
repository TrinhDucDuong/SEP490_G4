import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchBlogs } from "../../hooks/Admin/useFetchBlogManagementAPI.js";
import BlogCard from "../../components/common/Admin/BlogCard.jsx";

function BlogManagement() {
    const { blogs, loading } = useFetchBlogs();

    if (loading) return <div className="p-4 text-gray-700">Đang tải dữ liệu blog...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
                <Link to="/admin/blogs/create" className="px-2 py-1 bg-green-200 border border-green-900 text-green-900 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200">
                    + Tạo bài viết
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <BlogCard key={blog.blogId} blog={blog} />
                ))}
            </div>
        </div>
    );
}

export default BlogManagement;
