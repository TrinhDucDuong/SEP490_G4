import React, { useState, useEffect } from 'react';
import { BlogManagementAPI } from '../../../utils/api/Admin/BlogManagementAPI.js';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ArrowLeft } from 'lucide-react';
import { useFetchProducts } from '../../../hooks/Customer/useFetchProducts.js';

function BlogForm({ isEdit = false }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [blogInputData, setBlogInputData] = useState({
        blogTitle: '',
        content: '',
        relatedProductIds: [],
        blogTags: []
    });

    const [blogImages, setBlogImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const { products, loading: loadingProducts } = useFetchProducts();

    useEffect(() => {
        if (isEdit && id) {
            BlogManagementAPI.getById(id).then(res => {
                const blog = res.data.blog;
                setBlogInputData({
                    blogTitle: blog.blogTitle,
                    content: blog.content,
                    relatedProductIds: blog.relatedProducts?.map(p => p.productId) || [],
                    blogTags: blog.blogTags || []
                });
                setExistingImages(blog.blogImages || []);
            });
        }
    }, [isEdit, id]);

    const handleChange = (e) => {
        setBlogInputData({ ...blogInputData, [e.target.name]: e.target.value });
    };

    const handleRelatedProductsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedIds = selectedOptions.map(option => parseInt(option.value));
        setBlogInputData({ ...blogInputData, relatedProductIds: selectedIds });
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== "");
        setBlogInputData({ ...blogInputData, blogTags: tags });
    };

    const handleImagesChange = (e) => {
        setBlogImages([...e.target.files]);
    };

    const handleRemoveExistingImage = (index) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append(
                "blogInputData",
                new Blob([JSON.stringify(blogInputData)], {
                    type: "application/json",
                })
            );

            if (blogImages.length > 0) {
                blogImages.forEach((file) => {
                    formData.append("blogImages", file);
                });
            } else {
                formData.append("blogImages", new Blob([], {}));
            }

            if (isEdit) {
                await BlogManagementAPI.update(id, formData);
            } else {
                await BlogManagementAPI.create(formData);
            }

            navigate("/admin/blogs");
        } catch (error) {
            console.error("Lỗi khi gửi blog:", error);
            alert("Có lỗi xảy ra khi gửi blog");
        }
    };

    return (
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <Link to="/admin/blogs" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
                    <ArrowLeft size={20} /> <span>Quay lại</span>
                </Link>
            </div>

            <div className="border border-black rounded-lg p-6 shadow-md w-full">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                    {isEdit ? "Chỉnh sửa" : "Tạo mới"} bài viết
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                        <input
                            type="text"
                            name="blogTitle"
                            value={blogInputData.blogTitle}
                            onChange={handleChange}
                            placeholder="Tiêu đề bài viết"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                        <div className="border rounded-lg p-2">
                            <CKEditor
                                editor={ClassicEditor}
                                data={blogInputData.content}
                                config={{
                                    height: '400px',
                                }}
                                onReady={(editor) => {
                                    editor.editing.view.change(writer => {
                                        writer.setStyle("height", "400px", editor.editing.view.document.getRoot());
                                    });
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setBlogInputData(prev => ({ ...prev, content: data }));
                                }}
                            />

                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn sản phẩm liên quan</label>
                        {loadingProducts ? (
                            <p className="text-gray-500">Đang tải danh sách sản phẩm...</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto border rounded-lg p-4">
                                {products.map((product) => {
                                    const isChecked = blogInputData.relatedProductIds.includes(product.productId);
                                    const thumbnail = product.images?.[0]?.imageUrl || "https://via.placeholder.com/150";
                                    return (
                                        <label
                                            key={product.productId}
                                            className={`flex items-center gap-3 border rounded-lg p-2 cursor-pointer transition ${
                                                isChecked ? "bg-blue-100 border-blue-400" : "bg-white"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                value={product.productId}
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    const updated = isChecked
                                                        ? blogInputData.relatedProductIds.filter(id => id !== value)
                                                        : [...blogInputData.relatedProductIds, value];
                                                    setBlogInputData({ ...blogInputData, relatedProductIds: updated });
                                                }}
                                            />
                                            <img
                                                src={thumbnail}
                                                alt={product.productName}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <span className="text-sm font-medium">{product.productName}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (ngăn cách bởi dấu phẩy)</label>
                        <input
                            type="text"
                            value={blogInputData.blogTags.join(', ')}
                            onChange={handleTagsChange}
                            placeholder="Ví dụ: tech, news, ai"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bài viết</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImagesChange}
                            className="block w-full text-sm text-gray-600"
                            required={!isEdit}
                        />

                        {blogImages.length > 0 && (
                            <div className="mt-4">
                                <p className="font-semibold mb-2 text-gray-700">Ảnh mới tải lên:</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {Array.from(blogImages).map((file, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="h-28 object-cover rounded-lg border"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEdit && existingImages.length > 0 && (
                            <div className="mt-6">
                                <p className="font-semibold mb-2 text-gray-700">Ảnh hiện tại:</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {existingImages.map((img, index) => (
                                        <div key={img.imageId} className="relative group">
                                            <img
                                                src={img.imageUrl}
                                                alt="Ảnh cũ"
                                                className="h-28 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded-full text-xs opacity-90 hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black border border-black text-white rounded-full hover:bg-white hover:text-black transition font-medium"
                        >
                            {isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BlogForm;
