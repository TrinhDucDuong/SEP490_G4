import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShowSection from "../../components/common/ShowSection.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from "framer-motion";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productSizes, setProductSizes] = useState([]);
    const [productColors, setProductColors] = useState([]);
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
        { label: "Chi tiết sản phẩm" }
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`http://localhost:9999/product/${id}`);
            const data = await res.json();

            setProduct(data.product);
            setProductSizes(data.productSizes || []);
            setProductColors(data.productColors || []);
        };
        fetchProduct();
    }, [id]);

    if (!product) return (
        <div className="text-center py-10">
            <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-300 rounded-xl" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
        </div>
    );

    const images = (product.images || []).map(img => img.imageUrl);
    const displayImages = images.slice(0, 4);
    const extraImageCount = images.length - displayImages.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6"
        >
            <div className="px-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-4 mt-6">
                <div className="w-full lg:w-2/3">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        {displayImages.map((img, i) => (
                            <div key={i} className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer">
                                <Zoom>
                                    <img
                                        src={img}
                                        alt={`Ảnh ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4">Đánh giá</h2>
                        <p className="text-gray-500 italic">Chưa có đánh giá.</p>
                    </div>

                    <div className="mt-10 space-y-4">
                        <ShowSection label="Câu chuyện sản phẩm" show={showStory} onToggle={() => setShowStory(!showStory)}>
                            <>{product.story || 'Không có'}</>
                        </ShowSection>

                        <ShowSection label="Mô tả sản phẩm" show={showDescription} onToggle={() => setShowDescription(!showDescription)}>
                            <>{product.productDescription}</>
                        </ShowSection>

                        <ShowSection label="Thông tin chi tiết" show={showDetails} onToggle={() => setShowDetails(!showDetails)}>
                            <ul className="list-disc list-inside">
                                <li>Mã: {product.productId}</li>
                                <li>Giá: {product.unitPrice?.toLocaleString()}₫</li>
                                <li>Đã bán: {product.totalSoldOut || 0}</li>
                            </ul>
                        </ShowSection>

                        <ShowSection label="Chăm sóc" show={showHelptext} onToggle={() => setShowHelptext(!showHelptext)}>
                            <span>Vui lòng bảo quản nơi khô ráo, tránh ánh sáng trực tiếp.</span>
                        </ShowSection>

                        <ShowSection label="Cách kiểm tra Auth" show={showAuth} onToggle={() => setShowAuth(!showAuth)}>
                            <span>Kiểm tra mã vạch và mã QR chính hãng từ nhà sản xuất.</span>
                        </ShowSection>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 pl-0 lg:pl-8 border-l-0 lg:border-l-2 border-gray-200 space-y-4">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Mã sản phẩm: #{product.productId}</span>
                        <span>⭐ {product.starRateAvg || 0}</span>
                    </div>
                    <h1 className="text-3xl font-bold">{product.productName}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-red-500">{product.unitPrice.toLocaleString()}đ</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-medium">Màu sắc:</span>
                        <div className="flex flex-row gap-2 items-center">
                            {productColors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedColor(color.colorHex)}
                                    className={`w-6 h-6 rounded-full border-2 ${selectedColor === color.colorHex ? 'border-black' : 'border-gray-300'}`}
                                    style={{ backgroundColor: color.colorHex }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="font-medium mb-1">Kích thước:</div>
                        <div className="flex gap-2 flex-wrap">
                            {productSizes.map((size, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1 rounded-sm ${
                                        selectedSize === size ? 'bg-black text-white' : 'bg-white border'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

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

            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4">Có thể bạn sẽ thích</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="border p-4 rounded-lg text-center">Sản phẩm {n}</div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;