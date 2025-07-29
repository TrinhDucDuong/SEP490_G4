import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFetchBlogById } from '../../../hooks/Admin/useFetchBlogManagementAPI.js';
import { format } from 'date-fns';
import { BlogManagementAPI } from "../../../utils/api/Admin/BlogManagementAPI.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from "../../../components/common/Customer/ConfirmDialog.jsx";

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
        <div className="p-6 max-w-5xl mx-auto">
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

            {blog.tags?.length > 0 && (
                <div className="mb-10">
                    <h2 className="font-semibold mb-2">Tags:</h2>
                    <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

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

            <div
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>


            {blog.relatedProducts?.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {blog.relatedProducts.map((product) => {
                            const thumbnail = product.images?.[0]?.imageUrl || "https://via.placeholder.com/300";
                            const variants = product.productVariants || [];

                            return (
                                <div
                                    key={product.productId}
                                    className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
                                >
                                    <img
                                        src={thumbnail}
                                        alt={product.productName}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-1">{product.productName}</h3>
                                        <p className="text-red-600 font-bold mb-2">
                                            {product.unitPrice?.toLocaleString()}₫
                                        </p>

                                        {variants.length > 0 && (
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                {variants.map((variant, idx) => (
                                                    <div key={idx} className="flex items-center gap-1">
                                                        <span className="px-2 py-1 bg-gray-200 text-sm rounded">
                                                            {variant.productSize?.replace("SIZE_", "")}
                                                        </span>
                                                        {variant.color?.colorHex && (
                                                            <span
                                                                className="w-4 h-4 rounded-full border"
                                                                style={{ backgroundColor: variant.color.colorHex }}
                                                            ></span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <Link
                                            to={`/products/${product.productId}`}
                                            className="block mt-2 text-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogDetailManager;
