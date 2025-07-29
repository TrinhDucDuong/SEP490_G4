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
import { useCart } from "../../../context/CartContext.jsx";
import { useActionLogger } from "../../../utils/api/Customer/Log/useActionLogger.js";
import parse from 'html-react-parser';
import {useFetchRelatedProducts} from "../../../hooks/Customer/useFetchRelatedProducts.js";
import ProductScrollSlider from "../../../components/ui/product/Common/ProductScrollSlider.jsx";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productSizes, setProductSizes] = useState([]);
    const [productColors, setProductColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [filterStar, setFilterStar] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const { logAction } = useActionLogger();

    const { addToCart } = useCart();
    const { starRates, totalCount, loading: starRateLoading } = useFetchStarRate(product?.productId, filterStar, pageNumber, 3);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`);
                if (!res.ok) throw new Error('Lỗi tải sản phẩm');
                const data = await res.json();
                const uniqueSizes = Array.from(new Set(data.productSizes));
                const seenColors = new Set();
                const uniqueColors = data.productColors.filter(color => {
                    if (seenColors.has(color.colorHex)) return false;
                    seenColors.add(color.colorHex);
                    return true;
                });
                setProduct(data.product);
                setProductSizes(uniqueSizes);
                setProductColors(uniqueColors);
                setSelectedImage(data.product?.images?.[0]?.imageUrl || null);
            } catch (err) {
                toast.error(err.message || 'Lỗi tải sản phẩm');
            }
        };
        fetchProduct();
    }, [id]);

    const currentVariant = product?.productVariants?.find(
        v => v.colorHex === selectedColor && v.productSize === selectedSize
    );

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Vui lòng chọn màu sắc và kích thước");
            return;
        }

        if (!currentVariant) {
            toast.error("Sản phẩm với màu và kích thước này hiện không có trong kho");
            return;
        }

        if (quantity > currentVariant.quantity) {
            toast.error("Số lượng vượt quá số lượng tồn kho!");
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
            await logAction('ADD_TO_CART', currentVariant?.productVariantId);
            toast.success("Đã thêm sản phẩm vào giỏ hàng");
        } catch (error) {
            toast.error(error.message || 'Lỗi khi thêm vào giỏ hàng');
        }
    };

    const images = (product?.images || []).map(img => img.imageUrl);
    const breadcrumbItems = [
        { label: 'Trang chủ', to: '/' },
        { label: 'Sản phẩm', to: '/products' },
        { label: product?.productName || 'Chi tiết sản phẩm' },
    ];

    const { relatedProducts, loading: relatedLoading } = useFetchRelatedProducts({
        categoryId: product?.category?.categoryId,
        brandId: product?.brand?.brandId,
        excludeProductId: product?.productId
    });

    if (!product) return <div className="text-center py-20">Đang tải sản phẩm...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 py-6"
        >
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex flex-col lg:flex-row gap-12 mt-6">
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
                                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-all duration-200 ${selectedImage === img ? 'ring-2 ring-indigo-500 border-indigo-500 scale-105' : 'hover:ring-2 hover:ring-gray-400 hover:scale-105'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="space-y-2 flex justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
                            <div className="flex flex-row gap-4">
                                <div className="text-sm text-gray-600"><strong>Thương hiệu:</strong> {product.brand?.brandName}</div>
                                <div className="text-sm text-gray-600"><strong>Danh mục:</strong> {product.category?.categoryName}</div>
                            </div>
                            <div className="text-red-500 text-2xl mt-2 font-semibold">
                                {product.unitPrice.toLocaleString()}₫
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                {product.starRateAvg?.toFixed(1) || '0.0'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Màu sắc:</div>
                        <div className="flex gap-2">
                            {productColors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedColor(color.colorHex)}
                                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.colorHex ? 'ring-2 ring-black' : 'hover:border-black'} border-gray-300`}
                                    style={{ backgroundColor: color.colorHex }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Kích thước:</div>
                        <div className="flex gap-2 flex-wrap">
                            {productSizes.map((size, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-2 py-1 border border-black text-sm font-medium ${selectedSize === size ? 'bg-blue-200 text-black border-blue-200' : 'bg-white border-gray-200 hover:bg-blue-400 hover:text-white'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-700">Số lượng:</div>
                        <div className="flex border rounded-md overflow-hidden w-fit">
                            <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-r"
                            >-</button>
                            <div className="w-10 h-10 flex items-center justify-center text-gray-700 font-semibold">{quantity}</div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentVariant && quantity + 1 > currentVariant.quantity) {
                                        toast.info("Đã đạt số lượng tồn kho tối đa");
                                        return;
                                    }
                                    setQuantity(prev => prev + 1);
                                }}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l"
                            >+</button>
                        </div>
                        {selectedColor && selectedSize && (
                            <div className="text-sm text-gray-500">
                                {currentVariant ? `Còn lại: ${currentVariant.quantity} sản phẩm` : 'Không có sản phẩm tồn kho'}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-black text-white hover:bg-white hover:text-black border border-black py-2 px-4 rounded font-medium w-1/2"
                        >Thêm vào giỏ hàng</button>
                        <button className="bg-white text-black border border-gray-600 py-2 px-4 rounded font-medium hover:bg-black hover:text-white w-1/2">
                            Mua ngay
                        </button>
                    </div>

                    <div className="text-sm text-gray-600 border-t pt-4 space-y-3">
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faTruck} className="text-teal-500 mt-1" /><p>Miễn phí vận chuyển toàn quốc với đơn từ 500.000₫.</p></div>
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faBoxesPacking} className="text-teal-500 mt-1" /><p>Đổi trả dễ dàng trong vòng 7 ngày nếu sản phẩm lỗi.</p></div>
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faThumbsUp} className="text-teal-500 mt-1" /><p>Cam kết 100% chính hãng và chất lượng cao.</p></div>
                        <div className="flex items-start gap-2"><FontAwesomeIcon icon={faPhoneVolume} className="text-teal-500 mt-1" /><p>Hỗ trợ khách hàng 24/7 qua hotline: 1800 1234.</p></div>
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-10 text-sm text-gray-700">
                <section>
                    <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
                    <div className="leading-relaxed">{parse(product.productDescription)}</div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-2">Câu chuyện</h2>
                    <p>{product.story || 'Không có câu chuyện sản phẩm.'}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h2>
                    <ul className="list-disc list-inside">
                        <li>Mã: {product.productId}</li>
                        <li>Giá: {product.unitPrice?.toLocaleString()}₫</li>
                        <li>Đã bán: {product.totalSoldOut || 0}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-2">Đánh giá</h2>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center text-4xl font-bold text-yellow-500">
                            {product.starRateAvg?.toFixed(1) || '0.0'}
                            <FontAwesomeIcon icon={faStar} className="ml-2" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['', 5, 4, 3, 2, 1].map((num) => (
                                <button
                                    key={num}
                                    className={`px-3 py-1.5 rounded-full border ${filterStar === num ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
                </section>
            </div>

            {relatedProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm liên quan</h2>
                    <ProductScrollSlider products={relatedProducts} />
                </section>
            )}
        </motion.div>
    );
};

export default ProductDetail;
