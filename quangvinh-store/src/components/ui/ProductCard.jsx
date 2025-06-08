import { useState, useEffect, useRef } from "react";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProductCard({ product }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const intervalRef = useRef(null);
    console.log(product.images);
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
            className="bg-white rounded-2xl shadow-md p-4 m-2 flex flex-col hover:shadow-xl hover:cursor-pointer transition duration-100"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                    src={currentImage || "/assets/images/placeholder.jpg"}
                    alt={product.name}
                    className="object-contain max-h-full max-w-full transition duration-300"
                />
            </div>
            <h3 className="text-gray-800 font-semibold text-base truncate">{product.name}</h3>
            <p className="text-gray-600 font-medium text-sm">${product.price}</p>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={i < fullStars ? solidStar : regularStar}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-500">{reviews} đánh giá</span>
            </div>
            <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                Thêm nhanh
            </button>
        </div>
    );
}

export default ProductCard;
