import { Link } from "react-router-dom";

function CategoryBanner({ categories }) {
    if (!categories) return null;

    return (
        <div className="relative group w-full h-[550px] overflow-hidden rounded-2xl shadow-lg">
            <Link to="/products?category=all" className="block w-full h-full">
                <img
                    src={categories.image}
                    alt={categories.title || "Banner image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {categories.title && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <h2 className="text-white text-4xl font-bold drop-shadow-lg">
                            {categories.title}
                        </h2>
                    </div>
                )}
            </Link>
        </div>
    );
}

export default CategoryBanner;
