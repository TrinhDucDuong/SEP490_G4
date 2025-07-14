import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTruck, faBoxesPacking, faThumbsUp, faThumbsDown, faPhoneVolume, faStar
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";
import { useFetchStarRate } from "../../../hooks/Customer/useFetchStarRate";
import {useCart} from "../../../context/CartContext.jsx";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productSizes, setProductSizes] = useState([]);
    const [productColors, setProductColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tab, setTab] = useState('desc');
    const [quantity, setQuantity] = useState(1);
    const [filterStar, setFilterStar] = useState('');
    const [pageNumber, setPageNumber] = useState(0);


    const { addToCart } = useCart();
    const { starRates, totalCount, loading: starRateLoading } = useFetchStarRate(product?.productId, filterStar, pageNumber, 3);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:9999/product/${id}`);
                if (!res.ok) throw new Error('Lỗi tải sản phẩm');
                const data = await res.json();
                setProduct(data.product);
                setProductSizes(data.productSizes || []);
                setProductColors(data.productColors || []);
                setSelectedImage(data.product?.images?.[0]?.imageUrl || null);
            } catch (err) {
                toast.error(err.message || 'Lỗi tải sản phẩm');
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Vui lòng chọn màu sắc và kích thước");
            return;
        }

        try {
            await addToCart({
                productId: product.productId,
                colorHexCode: selectedColor,
                sizeCode: selectedSize,
                quantity,
                price: product.unitPrice,
                productName: product.productName,
                productImage: selectedImage || product.images?.[0]?.imageUrl || '',
            });
            toast.success("Đã thêm sản phẩm vào giỏ hàng");
        } catch (error) {
            toast.error(error.message || 'Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (!product) return <div className="text-center py-20">Đang tải sản phẩm...</div>;

    const images = (product.images || []).map(img => img.imageUrl);
    const breadcrumbItems = [
        { label: 'Trang chủ', to: '/' },
        { label: 'Sản phẩm', to: '/products' },
        { label: product.productName || 'Chi tiết sản phẩm' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 py-6"
        >
            <Breadcrumb items={breadcrumbItems} />

            {/* Sản phẩm chính */}
            <div className="flex flex-col lg:flex-row gap-12 mt-6">
                {/* Hình ảnh */}
                <div className="w-full lg:w-1/2">
                    <div className="rounded-xl overflow-hidden border aspect-square">
                        <Zoom>
                            <img
                                src={selectedImage || images[0]}
                                alt="main"
                                className="w-full h-full object-cover"
                            />
                        </Zoom>
                    </div>
                    <div className="flex gap-3 mt-4">
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setSelectedImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-all duration-200 ${
                                    selectedImage === img
                                        ? 'ring-2 ring-indigo-500 border-indigo-500 scale-105'
                                        : 'hover:ring-2 hover:ring-gray-400 hover:scale-105'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Mã sản phẩm: #{product.productId}</span>
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                {product.starRateAvg || 0}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
                        <div className="text-red-500 text-2xl font-semibold">
                            {product.unitPrice.toLocaleString()}₫
                        </div>
                    </div>

                    {/* Màu sắc */}
                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Màu sắc:</div>
                        <div className="flex gap-2">
                            {productColors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedColor(color.colorHex)}
                                    className={`w-8 h-8 rounded-full border-2 ${
                                        selectedColor === color.colorHex
                                            ? 'ring-2 ring-black'
                                            : 'hover:border-black'
                                    } border-gray-300`}
                                    style={{ backgroundColor: color.colorHex }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Kích thước */}
                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Kích thước:</div>
                        <div className="flex gap-2 flex-wrap">
                            {productSizes.map((size, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${
                                        selectedSize === size
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white border-gray-300 hover:bg-black hover:text-white'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Số lượng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng:</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Nút hành động */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="bg-black text-white py-2.5 rounded-full font-medium hover:bg-gray-800"
                        >
                            Thêm vào giỏ hàng
                        </button>
                        <button className="bg-white text-indigo-600 border border-indigo-600 py-2.5 rounded-full font-medium hover:bg-indigo-50">
                            Mua ngay
                        </button>
                    </div>

                    {/* Chính sách */}
                    <div className="text-sm text-gray-600 border-t pt-4 space-y-3">
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faTruck} className="text-teal-500 mt-1" /> <p>Miễn phí vận chuyển toàn quốc với đơn từ 500.000₫.</p></div>
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faBoxesPacking} className="text-teal-500 mt-1" /> <p>Đổi trả dễ dàng trong vòng 7 ngày nếu sản phẩm lỗi.</p></div>
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faThumbsUp} className="text-teal-500 mt-1" /> <p>Cam kết 100% chính hãng và chất lượng cao.</p></div>
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faPhoneVolume} className="text-teal-500 mt-1" /> <p>Hỗ trợ khách hàng 24/7 qua hotline: 1800 1234.</p></div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-12">
                <div className="flex gap-6 border-b">
                    {['desc', 'story', 'detail', 'review'].map((key) => (
                        <button
                            key={key}
                            className={`pb-2 text-sm font-medium ${
                                tab === key ? 'border-b-2 border-black text-black' : 'text-gray-500'
                            }`}
                            onClick={() => setTab(key)}
                        >
                            {key === 'desc' ? 'Mô tả' : key === 'story' ? 'Câu chuyện' : key === 'detail' ? 'Chi tiết' : 'Đánh giá'}
                        </button>
                    ))}
                </div>

                <div className="mt-4 text-sm text-gray-700">
                    {tab === 'desc' && <p>{product.productDescription}</p>}
                    {tab === 'story' && <p>{product.story || 'Không có câu chuyện sản phẩm.'}</p>}
                    {tab === 'detail' && (
                        <ul className="list-disc list-inside">
                            <li>Mã: {product.productId}</li>
                            <li>Giá: {product.unitPrice?.toLocaleString()}₫</li>
                            <li>Đã bán: {product.totalSoldOut || 0}</li>
                        </ul>
                    )}
                    {tab === 'review' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center text-4xl font-bold text-yellow-500">
                                    {product.starRateAvg?.toFixed(1) || '0.0'}
                                    <FontAwesomeIcon icon={faStar} className="ml-2" />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {['', 5, 4, 3, 2, 1].map((num) => (
                                        <button
                                            key={num}
                                            className={`px-3 py-1.5 rounded-full border ${
                                                filterStar === num ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                            onClick={() => setFilterStar(num)}
                                        >
                                            {num === '' ? 'Tất cả' : `${num} ★`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {starRateLoading ? (
                                <p>Đang tải đánh giá...</p>
                            ) : starRates.length === 0 ? (
                                <p>Chưa có đánh giá nào.</p>
                            ) : (
                                <div className="space-y-6">
                                    {starRates.map((rate, index) => (
                                        <div key={index} className="flex gap-4 border-b pb-6">
                                            <img
                                                src={rate.profileImage?.imageUrl}
                                                alt={rate.profileName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <p className="font-semibold">{rate.profileName}</p>
                                                    <span className="text-sm text-gray-500">{new Date(rate.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="flex gap-1 text-yellow-400 my-1">
                                                    {Array.from({ length: rate.starRate }).map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} />
                                                    ))}
                                                </div>
                                                <div className="text-sm italic text-gray-500 mb-1">
                                                    Phân loại hàng: {rate.productVariant.color.colorHex} / Size {rate.productVariant.productSize}
                                                </div>
                                                <p className="text-gray-700">{rate.comment}</p>
                                                <div className="mt-2 flex gap-4 text-gray-400 text-sm">
                                                    <button><FontAwesomeIcon icon={faThumbsUp} /> Hữu ích</button>
                                                    <button><FontAwesomeIcon icon={faThumbsDown} /> Không hữu ích</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setPageNumber(prev => prev + 1)}
                                    className="px-6 py-2 rounded-full border text-sm hover:bg-gray-100"
                                >
                                    Đọc Thêm Đánh Giá
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;
