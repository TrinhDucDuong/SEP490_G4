import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

function ProductScrollSlider({ products }) {
    return (
        <div className="relative w-full">
            <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 gap-4 scrollbar-hide">
                {products.map((product, index) => (
                    <Link
                        to={`/products/${product.productId}`}
                        key={index}
                        className="flex-shrink-0 snap-start"
                    >
                        <div className="transition-transform duration-300 hover:scale-105 w-[220px]">
                            <ProductCard product={product} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ProductScrollSlider;
