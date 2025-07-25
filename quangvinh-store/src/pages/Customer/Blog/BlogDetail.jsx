import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";
import defaultImage from "../../../assets/images/404.jpg";
import { useFetchBlogs } from "../../../hooks/Customer/useFetchBlog.js";
import RecentBlogsSidebar from "./RecentBlogsSidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext.jsx";

function BlogDetail() {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { blogs: allBlogs, loading: loadingBlogs } = useFetchBlogs();
    const { addToCart } = useCart();

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${blogId}`);
                if (!res.ok) throw new Error("Không thể tải bài viết");
                const data = await res.json();
                setBlog(data.blog);
                const related = data.blog.relatedProductIds || [];
                const fetchAll = related.map(id => fetch(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`).then(r => r.json()));
                const relatedData = await Promise.all(fetchAll);
                const products = relatedData.map(res => res.product).filter(Boolean);
                setRelatedProducts(products);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    const recentBlogs = allBlogs?.filter((b) => String(b.blogId) !== String(blogId)).slice(0, 5);

    const handleAddToCart = (product) => {
        const variant = product.productVariants?.[0];
        if (!variant) return;
        addToCart({
            productId: product.productId,
            quantity: 1,
            productName: product.productName,
            imageUrl: product.images?.[0]?.imageUrl,
            unitPrice: product.unitPrice,
            size: variant.productSize,
            colorHex: variant.color?.colorHex,
        });
    };

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
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                ></div>

                            </div>

                            <div className="lg:w-1/3 space-y-10">
                                {loadingBlogs ? (
                                    <p className="text-gray-500">Đang tải bài viết gần đây...</p>
                                ) : (
                                    recentBlogs?.length > 0 && (
                                        <RecentBlogsSidebar blogs={recentBlogs} />
                                    )
                                )}

                                {relatedProducts.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-800">Sản phẩm liên quan</h3>
                                        {relatedProducts.map(product => (
                                            <div
                                                key={product.productId}
                                                className="border rounded-lg p-4 shadow-md space-y-3 cursor-pointer hover:shadow-lg transition"
                                                onClick={() => navigate(`/products/${product.productId}`)}
                                            >
                                                <img
                                                    src={product.images?.[0]?.imageUrl || defaultImage}
                                                    alt={product.productName}
                                                    className="w-full h-40 object-cover rounded"
                                                />

                                                <h4 className="font-semibold text-gray-800">{product.productName}</h4>
                                                <p className="text-red-600 font-bold">{product.unitPrice?.toLocaleString()}₫</p>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm text-gray-600">Màu sắc:</span>
                                                    {product.productVariants?.map((variant, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="w-5 h-5 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: variant.colorHex }}
                                                        ></span>
                                                    ))}
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    Kích cỡ:&nbsp;
                                                    {product.productVariants?.map(v => v.productSize).join(", ")}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
