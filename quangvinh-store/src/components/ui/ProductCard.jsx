import { useState, useEffect, useRef } from "react";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProductCard({ product }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const intervalRef = useRef(null);
    const images = product.images?.length ? product.images : [product.image];
    const currentImage = images[imageIndex];
    const rating = product.rating || 0;
    const reviews = product.reviews?.length || 0;
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
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="absolute top-3 left-3 bg-[#FFB800] text-white text-xs font-semibold px-2 py-1 rounded">
                MỚI
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <img
                    src={currentImage || "/assets/images/placeholder.jpg"}
                    alt={product.name}
                    className="object-contain max-h-full max-w-full transition duration-300"
                />
            </div>
            <h3 className="text-gray-800 font-medium text-sm truncate mb-1">{product.name}</h3>
            <p className="text-black text-base font-bold mb-2">{product.price.toLocaleString()} VND</p>
            <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={i < fullStars ? solidStar : regularStar} />
                ))}
                <span className="text-gray-500 text-xs ml-2">{reviews} đánh giá</span>
            </div>

            {/* Nút thêm */}
            <button className="w-full bg-black text-white text-sm py-2 rounded-md hover:bg-gray-800 transition">
                Thêm nhanh
            </button>
        </div>

    );
}

export default ProductCard;
