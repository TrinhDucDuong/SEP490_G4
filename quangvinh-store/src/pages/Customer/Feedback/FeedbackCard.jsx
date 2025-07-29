import React, { useState, useEffect, useRef, useMemo } from "react";
import defaultImage from "../../../assets/images/404.jpg";

const FeedbackCard = ({ title, content, images = [] }) => {
    const [hovered, setHovered] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const intervalRef = useRef(null);

    const displayImages = useMemo(() => {
        const filtered = images
            .map(img => img?.imageUrl)
            .filter(url => typeof url === "string" && url.trim() !== "");
        return filtered.length > 0 ? filtered : [defaultImage];
    }, [images]);

    useEffect(() => {
        if (hovered && displayImages.length > 1) {
            intervalRef.current = setInterval(() => {
                setImageIndex(prev => (prev + 1) % displayImages.length);
            }, 1500);
        } else {
            clearInterval(intervalRef.current);
            setImageIndex(0);
        }
        return () => clearInterval(intervalRef.current);
    }, [hovered, displayImages]);

    return (
        <div
            className="bg-white shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                    src={displayImages[imageIndex]}
                    alt={`Feedback - ${imageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
            </div>

            <div className="p-4 text-black">
                <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
            </div>
        </div>
    );
};

export default FeedbackCard;
