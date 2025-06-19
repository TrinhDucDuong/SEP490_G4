import { useState, useEffect, useRef } from "react";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  productPicture from '../../assets/images/ao.png';

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
    className="
        relative bg-white rounded-2xl shadow-md border border-transparent
        hover:shadow-2xl hover:-translate-y-2 hover:scale-105
        hover:border-indigo-400 transition-all duration-300 ease-in-out
        p-4 cursor-pointer group
        "
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
>
    {/*<div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded shadow-lg ring-1 ring-yellow-300 animate-pulse">*/}
    {/*    MỚI*/}
    {/*</div>*/}
    <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
        <img
            src={currentImage || productPicture}
            alt={product.name}
            className="object-contain max-h-full max-w-full transition-transform duration-500 group-hover:scale-110"
        />
    </div>
    <h3 className="text-gray-900 font-bold text-base mb-1 truncate">{product.name}</h3>
    <p className="text-indigo-700 text-lg font-bold mb-2">{product.price.toLocaleString()} VND</p>
    <div className="flex items-center gap-1 text-yellow-400 text-base mb-2">
        {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={i < fullStars ? solidStar : regularStar} />
        ))}
        <span className="text-gray-500 text-sm ml-2">{reviews} đánh giá</span>
    </div>
    <button className="w-full bg-black text-white text-sm py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-400 transition-all duration-300 font-bold">
        Thêm nhanh
    </button>
</div>
    );
}

export default ProductCard;