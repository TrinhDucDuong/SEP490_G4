import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ShowSection from "../../components/common/ShowSection.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from "framer-motion";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const [showStory, setShowStory] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showHelptext, setShowHelptext] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    const breadcrumbItems = [
        { label: "Trang chủ", to: "/" },
        { label: "Sản phẩm", to: "/products" },
        { label: "Nam giới", to: "/products/men" },
        { label: "Phụ kiện" },
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`https://dummyjson.com/products/${id}`);
            const data = await res.json();
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="text-center py-10">
        <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-300 rounded-xl" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
    </div>;

    const sizes = [36, 37, 38, 39, 40];
    const availableSizes = [38, 39];
    const displayImages = product.images.slice(0, 4);
    const extraImageCount = product.images.length - displayImages.length;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
        
        <div className="mx-auto py-2">
            <div className="px-10">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex flex-col md:flex-row gap-8 px-10">
                <div className="w-full px-2 md:w-2/3">
                    <div className="grid grid-cols-2 gap-4">
                        {displayImages.map((img, i) => (
                            <div
                                key={i}
                                className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer max-w-[220px] max-h-[220px]"
                            >
                                <Zoom>
                                    <img
                                        src={img}
                                        alt={`${product.title} - ảnh ${i + 1}`}
                                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                                    />
                                </Zoom>
                                {i === 3 && extraImageCount > 0 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-xl font-semibold rounded-xl">
                                        +{extraImageCount}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Đánh giá sản phẩm */}
                    <div className="mt-10 px-2">
                        <h2 className="text-xl font-semibold mb-4">
                            Đánh giá ({product.reviews?.length || 0})
                        </h2>
                        {(product.reviews && product.reviews.length > 0) ? (
                            (showAllReviews ? product.reviews : product.reviews.slice(0, 3)).map((review, i) => (
                                <div key={i} className="border-t pt-4 pb-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{review.reviewerName}</span>
                                        <span>{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-yellow-500 mb-1">
                                        {"★".repeat(review.rating)}
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
                        )}
                        {product.reviews?.length > 3 && (
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="text-blue-600 mt-2"
                            >
                                {showAllReviews ? 'Ẩn bớt đánh giá' : 'Xem thêm đánh giá'}
                            </button>
                        )}
                    </div>

                    {/* Các section mô tả */}
                    <div className="mt-10 space-y-4 px-2">
                        <ShowSection label="Câu chuyện sản phẩm" show={showStory} setShow={setShowStory}>
                            <>{product.story || 'Không có'}</>
                        </ShowSection>
                        <ShowSection label="Mô tả sản phẩm" show={showDescription} setShow={setShowDescription}>
                            <>{product.description}</>
                        </ShowSection>
                        <ShowSection label="Thông tin chi tiết" show={showDetails} setShow={setShowDetails}>
                            <ul className="list-disc list-inside">
                                <li>SKU: {product.sku || 'Không có'}</li>
                                <li>Trọng lượng: {product.weight ? `${product.weight}g` : 'Không có'}</li>
                                {product.dimensions ? (
                                    <li>
                                        Kích thước: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}
                                    </li>
                                ) : (
                                    <li>Kích thước: Không có</li>
                                )}
                                <li>Tình trạng: {product.availabilityStatus || 'Không rõ'}</li>
                            </ul>
                        </ShowSection>
                        <ShowSection label="Chăm sóc" show={showHelptext} setShow={setShowHelptext}>
                            <span>Vui lòng bảo quản nơi khô ráo, tránh ánh sáng trực tiếp.</span>
                        </ShowSection>
                        <ShowSection label="Cách kiểm tra Auth" show={showAuth} setShow={setShowAuth}>
                            <span>Kiểm tra mã vạch và mã QR chính hãng từ nhà sản xuất.</span>
                        </ShowSection>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="md:w-1/3 border-l-2 pl-8 rounded space-y-4">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{product.category}</span>
                        <span>⭐ {product.rating}</span>
                    </div>
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-red-500">${product.price}</span>
                        {product.discountPercentage > 0 && (
                            <>
                <span className="line-through opacity-50">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
                                <span className="text-sm text-red-600 font-bold">
                  -{product.discountPercentage}%
                </span>
                            </>
                        )}
                    </div>

                    {/* Màu sắc */}
                    <div className="flex flex-col gap-2">
                        <span className="font-medium">Màu sắc:</span>
                        <div className="flex flex-row gap-2 items-center">
                            {(product.colors || ['#000', '#f00']).map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Kích thước */}
                    <div>
                        <div className="font-medium mb-1">Kích thước:</div>
                        <div className="flex gap-2">
                            {sizes.map((size) => {
                                const isAvailable = availableSizes.includes(size);
                                const isSelected = selectedSize === size;
                                return (
                                    <button
                                        key={size}
                                        disabled={!isAvailable}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-3 py-1 rounded-sm ${
                                            !isAvailable
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-black text-white'
                                                    : 'bg-white'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <button className="bg-white text-black border-2 rounded-3xl px-6 py-2 hover:bg-black hover:text-white transition">
                                Thêm vào giỏ hàng
                            </button>
                            <button className="text-red-500 text-2xl">♡</button>
                        </div>
                        <div>
                            <button className="bg-black text-white hover:bg-white hover:text-black border-2 px-6 py-2 rounded-full">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sản phẩm gợi ý */}
            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4">Có thể bạn sẽ thích</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="border p-2 rounded-lg text-center">Sản phẩm {n}</div>
                    ))}
                </div>
            </div>
        </div>
        </motion.div>
    );
};

export default ProductDetail;