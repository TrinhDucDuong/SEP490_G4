
import ProductCard from "./ProductCard.jsx";
import React from "react";


/**
 * Component hiển thị danh sách sản phẩm dạng **scroll ngang** (slider).
 *
 * Chức năng:
 * - Hiển thị nhiều `ProductCard` trong một hàng ngang.
 * - Cho phép scroll ngang mượt mà (`scroll-smooth`, `snap-x`).
 * - Khi không có sản phẩm → hiển thị thông báo "Không có sản phẩm".
 *
 * @author ngothangwork
 * @component
 *
 * @param {Object} props - Props của component
 * @param {Array<Object>} [props.products=[]] - Danh sách sản phẩm để hiển thị
 * @param {string} [props.className=""] - ClassName tuỳ chỉnh để thêm vào container
 *
 * @returns {JSX.Element} Slider hiển thị danh sách sản phẩm
 */

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
