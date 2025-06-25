import { useState, useEffect, useRef } from "react";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import productPicture from '../../../assets/images/ao.png';

function ProductCard({ product }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const intervalRef = useRef(null);
    const images = product.images?.length
        ? product.images.map(img => img.imageUrl)
        : [productPicture];

    const currentImage = images[imageIndex];
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
    }, [hovered, images.length]);

    return (
        <div
            className="relative bg-white shadow-md border border-transparent hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:border-indigo-400 transition-all duration-300 ease-in-out p-4 cursor-pointer group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="aspect-square bg-gray-50 overflow-hidden mb-4 flex items-center justify-center">
                <img
                    src={currentImage}
                    alt={product.productName}
                    className="object-contain max-h-full max-w-full transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = productPicture;
                    }}
                />
            </div>
            <p className="text-black text-sm font-bold py-1 mb-2">
                {product.unitPrice?.toLocaleString()}đ
            </p>
            <h3 className="text-gray-600 font-normal mb-1 truncate">
                {product.productName}
            </h3>
            <div className="text-gray-500 py-1 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
                {product.productDescription?.slice(0, 50)}...
            </div>
            <div className="flex items-center py-1 gap-1 text-yellow-400 text-base mb-2">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={i < fullStars ? solidStar : regularStar} />
                ))}
            </div>
        </div>
    );
}

export default ProductCard;
