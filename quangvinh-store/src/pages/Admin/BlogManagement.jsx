import React from 'react';
import { format } from 'date-fns';
import { useFetchBlogs } from "../../hooks/Admin/useFetchBlogManagementAPI.js";
import { Link } from 'react-router-dom';

function BlogManagement() {
    const { blogs, loading } = useFetchBlogs();

    if (loading) return <div className="p-4 text-gray-700">Đang tải dữ liệu blog...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý bài viết</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <Link to={`/admin/blogs/${blog.blogId}`} key={blog.blogId}>
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col cursor-pointer">
                            {blog.blogImages.length > 0 && (
                                <img
                                    src={blog.blogImages[0].imageUrl}
                                    alt="Blog"
                                    className="h-48 w-full object-cover rounded-xl mb-3"
                                />
                            )}
                            <h2 className="text-xl font-semibold mb-2">{blog.blogTitle}</h2>
                            <p className="text-gray-600 text-sm line-clamp-4">{blog.content}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                <div>Người tạo: <span className="font-medium">{blog.createdBy.username}</span></div>
                                <div>Ngày tạo: {format(new Date(blog.createdAt), 'dd/MM/yyyy')}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default BlogManagement;
