import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFetchBlogById } from '../../hooks/Admin/useFetchBlogManagementAPI';
import { format } from 'date-fns';
import { BlogManagementAPI } from "../../utils/api/Admin/BlogManagementAPI.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from "../../components/common/Customer/ConfirmDialog.jsx";


function BlogDetailManager() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { blog, loading } = useFetchBlogById(id);

    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const handleConfirmDelete = async () => {
        try {
            await BlogManagementAPI.delete(blog.blogId);
            toast.success("Đã xoá bài viết thành công!");
            setTimeout(() => navigate('/admin/blogs'), 1500);
        } catch (e) {
            toast.error("Xoá bài viết thất bại!");
            console.error(e);
        }
    };

    if (loading) return <div className="p-6 text-gray-700">Đang tải chi tiết bài viết...</div>;
    if (!blog) return <div className="p-6 text-red-600">Không tìm thấy bài viết.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <ToastContainer />
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Bạn có chắc chắn muốn xoá bài viết này không?"
            />

            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/blogs" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Quay lại danh sách
                </Link>
                <div className="mt-6 flex gap-4">
                    <Link
                        to={`/admin/blogs/${blog.blogId}/edit`}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Chỉnh sửa
                    </Link>
                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Xoá
                    </button>
                </div>
            </div>

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
