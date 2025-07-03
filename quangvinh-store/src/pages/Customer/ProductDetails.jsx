// src/components/ProductDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTruck, faBoxesPacking, faThumbsUp, faPhoneVolume, faStar
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import {AuthContext} from "../../context/AuthContext.jsx";
import useCart from "../../hooks/useCart.js";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";


const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productSizes, setProductSizes] = useState([]);
    const [productColors, setProductColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [tab, setTab] = useState('desc');
    const [quantity, setQuantity] = useState(1);

    const { account, token } = useContext(AuthContext);
    const { addToCart } = useCart(account?.accountId, token);

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
            } catch (err) {
                console.error('Lỗi khi fetch sản phẩm:', err);
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
                productImage: product.images?.[0]?.imageUrl || '',
            });
            toast.success("Đã thêm sản phẩm vào giỏ hàng");
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
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

            <div className="flex flex-col lg:flex-row gap-12 mt-6">
                {/* LEFT: Hình ảnh */}
                <div className="w-full lg:w-1/2">
                    <div className="rounded-xl overflow-hidden border aspect-square">
                        <Zoom>
                            <img src={images[0]} alt="main" className="w-full h-full object-cover" />
                        </Zoom>
                    </div>
                    <div className="flex gap-3 mt-4">
                        {images.slice(1, 5).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`thumb-${i}`}
                                className="w-20 h-20 object-cover rounded-lg border hover:ring-2 ring-indigo-500 cursor-pointer"
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: Thông tin */}
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

                    <div className="text-sm text-gray-600 border-t pt-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faTruck} className="text-teal-500 mt-1" />
                            <p>Miễn phí vận chuyển toàn quốc với đơn từ 500.000₫.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faBoxesPacking} className="text-teal-500 mt-1" />
                            <p>Đổi trả dễ dàng trong vòng 7 ngày nếu sản phẩm lỗi.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faThumbsUp} className="text-teal-500 mt-1" />
                            <p>Cam kết 100% chính hãng và chất lượng cao.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faPhoneVolume} className="text-teal-500 mt-1" />
                            <p>Hỗ trợ khách hàng 24/7 qua hotline: 1800 1234.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-12">
                <div className="flex gap-6 border-b">
                    {['desc', 'story', 'detail'].map((key) => (
                        <button
                            key={key}
                            className={`pb-2 text-sm font-medium ${
                                tab === key ? 'border-b-2 border-black text-black' : 'text-gray-500'
                            }`}
                            onClick={() => setTab(key)}
                        >
                            {key === 'desc' ? 'Mô tả' : key === 'story' ? 'Câu chuyện' : 'Chi tiết'}
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
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;