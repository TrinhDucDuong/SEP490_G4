import { useState, useEffect, useRef, memo, useMemo } from "react";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import productPicture from "../../../../assets/images/ao.png";
import { useNavigate } from "react-router-dom";
import {useActionLogger} from "../../../../utils/api/Customer/log/useActionLogger.js";


/**
 * Component hiển thị thẻ sản phẩm (ProductCard).
 *
 * Chức năng:
 * - Hiển thị ảnh sản phẩm (tự động xoay ảnh khi hover nếu có nhiều ảnh).
 * - Hiển thị giá sản phẩm, tên sản phẩm.
 * - Hiển thị đánh giá trung bình bằng sao (star rating).
 * - Khi click vào card sẽ:
 *   - Ghi lại hành động "VIEW" bằng `useActionLogger`.
 *   - Điều hướng đến trang chi tiết sản phẩm.
 *   - Reload lại trang để cập nhật thông tin.
 *
 * @author ngothangwork
 * @component
 *
 * @param {Object} props - Props của component
 * @param {Object} props.product - Dữ liệu sản phẩm
 * @param {number|string} props.product.productId - ID sản phẩm
 * @param {string} props.product.productName - Tên sản phẩm
 * @param {number} [props.product.unitPrice] - Giá sản phẩm (VND)
 * @param {Array<{imageUrl: string}>} [props.product.images] - Danh sách ảnh sản phẩm
 * @param {number} [props.product.starRateAvg] - Điểm đánh giá trung bình (0-5)
 *
 * @returns {JSX.Element} Thẻ hiển thị thông tin sản phẩm
 */

const ProductCard = memo(function ProductCard({ product }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    const { logAction } = useActionLogger();

    const images = useMemo(() => (
        product.images?.length ? product.images.map(img => img.imageUrl) : [productPicture]
    ), [product.images]);

    const rating = product.starRateAvg || 0;
    const fullStars = Math.floor(rating);

    useEffect(() => {
        if (hovered && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setImageIndex(prev => (prev + 1) % images.length);
            }, 1500);
        } else {
            clearInterval(intervalRef.current);
            setImageIndex(0);
        }
        return () => clearInterval(intervalRef.current);
    }, [hovered, images]);

    const handleClick = () => {
        logAction('VIEW', product.productId);
        navigate("/products/detail", { state: { productId: product.productId } });
        window.location.reload();
    };


    return (
        <div
            onClick={handleClick}
            className="relative bg-white rounded-sm shadow-sm p-1 cursor-pointer group hover:shadow-md hover:-translate-y-1 hover:border-indigo-100 border border-transparent transition-all duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="aspect-square bg-gray-100 overflow-hidden mb-4 relative flex items-center justify-center">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${product.productName} - Image ${index + 1}`}
                        className={`absolute w-full h-full object-contain max-h-full max-w-full transition-all duration-500 ease-in-out ${
                            index === imageIndex
                                ? 'opacity-100 translate-x-0'
                                : index > imageIndex
                                    ? 'opacity-0 translate-x-full'
                                    : 'opacity-0 -translate-x-full'
                        }`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = productPicture;
                        }}
                    />
                ))}
            </div>
            <p className="text-black-600 text-sm font-semibold mb-2">
                {typeof product.unitPrice === 'number'
                    ? product.unitPrice.toLocaleString() + '₫'
                    : 'Liên hệ'}
            </p>
            <h3 className="text-gray-800 text-base font-bold mb-1 truncate">{product.productName}</h3>
 {/*           <h3 className="text-gray-800 text-base font-bold mb-1 truncate">{product.brand.brandName}</h3>*/}
            <div className="flex items-center py-1 gap-1 text-yellow-400 text-base">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={i < fullStars ? solidStar : regularStar} />
                ))}
                <span className="text-sm text-gray-500 ml-1">({rating.toFixed(1)})</span>
            </div>
        </div>
    );
});

export default ProductCard;