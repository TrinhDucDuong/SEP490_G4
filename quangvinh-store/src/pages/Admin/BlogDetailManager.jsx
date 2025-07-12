import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchBlogById } from '../../hooks/Admin/useFetchBlogManagementAPI';
import { format } from 'date-fns';

function BlogDetailManager() {
    const { id } = useParams();
    const { blog, loading } = useFetchBlogById(id);

    if (loading) return <div className="p-6 text-gray-700">Đang tải chi tiết bài viết...</div>;
    if (!blog) return <div className="p-6 text-red-600">Không tìm thấy bài viết.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link to="/admin/blogs" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Quay lại danh sách
            </Link>

            {blog.blogImages.length > 0 && (
                <img
                    src={blog.blogImages[0].imageUrl}
                    alt="Blog Cover"
                    className="w-full h-64 object-cover rounded-xl mb-6"
                />
            )}

            <h1 className="text-3xl font-bold mb-2">{blog.blogTitle}</h1>
            <div className="text-sm text-gray-500 mb-4">
                Người tạo: <b>{blog.createdBy.username}</b> | Ngày tạo: {format(new Date(blog.createdAt), 'dd/MM/yyyy')}
            </div>

            <div className="prose max-w-none whitespace-pre-line">{blog.content}</div>
        </div>
    );
}

export default BlogDetailManager;
