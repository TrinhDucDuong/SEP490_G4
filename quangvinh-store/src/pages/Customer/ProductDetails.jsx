// pages/Admin/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://dummyjson.com/products/${id}`);
                if (!response.ok) throw new Error('Không tìm thấy sản phẩm');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

    if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img src={product.thumbnail} alt={product.title} className="w-full rounded-xl" />
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {product.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`image-${idx}`} className="w-full h-24 object-cover rounded" />
                        ))}
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="text-xl font-semibold text-red-500 mb-2">${product.price}</div>
                    <div className="mb-2">
                        <span className="font-medium">Danh mục:</span> {product.category}
                    </div>
                    <div className="mb-2">
                        <span className="font-medium">Thương hiệu:</span> {product.brand}
                    </div>
                    <div className="mb-2">
                        <span className="font-medium">Màu sắc:</span> {product.color || 'Không xác định'}
                    </div>
                    <div className="mb-4">
                        <span className="font-medium">Số lượng còn:</span> {product.stock}
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
