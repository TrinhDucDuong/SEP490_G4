import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import React from "react";

const ProductScrollSlider = React.memo(function ProductScrollSlider({ products = [], className = "" }) {
    return (
        <div className={`relative w-full ${className}`}>
            <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 gap-4 scrollbar-hide">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((product, idx) => (

                            <div className="transition-transform duration-300 hover:scale-105 w-[220px]">
                                <ProductCard product={product} />
                            </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center w-full py-8">
                        Không có sản phẩm
                    </div>
                )}
            </div>
        </div>
    );
});

export default ProductScrollSlider;
