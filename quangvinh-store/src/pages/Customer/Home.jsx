import { Link } from "react-router-dom";
import Carousel from '../../components/ui/home/Carousel.jsx';
import BrandSlider from '../../components/ui/home/BrandSlider.jsx';
import { useFetchProducts } from "../../hooks/useFetchAllProducts.js";
import { useFetchBrands } from "../../hooks/useFetchBrands.js";
import { useFetchCategories } from "../../hooks/useFetchCategories.js";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductScrollSlider from "../../components/ui/product/ProductScrollSlider.jsx";
import Banner from "../../components/ui/home/Banner.jsx";
import { motion } from "framer-motion";


function Home() {
    const { brands, loading: loadingBrands, error: errorBrands } = useFetchBrands();
    const { categories, loading: loadingCategories, error: errorCategories } = useFetchCategories();
    const { products, loading: loadingProducts, error: errorProducts } = useFetchProducts();

    return (
        <div className="bg-[#F2F2EE] text-black">
            <Carousel />

            <div className="w-full px-40 bg-black">
                {loadingBrands ? (
                    <p className="text-center text-white py-4">Đang tải thương hiệu...</p>
                ) : errorBrands ? (
                    <p className="text-center text-red-500 py-4">{errorBrands}</p>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <BrandSlider brands={brands.slice(0, 10)} />
                    </motion.div>
                )}
            </div>

            <div className="w-full px-28">
                <div className="flex justify-between items-center py-10">
                    <h2 className="text-4xl font-bold">ĐÓN ĐẦU XU HƯỚNG</h2>
                    <Link
                        className="text-black hover:text-yellow-400 transition flex items-center"
                        to="/products?category=all"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </div>
                {loadingProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorProducts ? (
                    <p className="text-center text-red-500">{errorProducts}</p>
                ) : (
                    <ProductScrollSlider products={products.slice(0, 10)} />
                )}
            </div>

            {!loadingCategories && !errorCategories && (
                <div className="px-28 py-10 space-y-8">
                    {categories.slice(0, 3).map((category, index) => (
                        <Banner
                            key={index}
                            item={category}
                            link={`/products?category=${encodeURIComponent(
                                category.name?.toLowerCase() || "all"
                            )}`}
                        />
                    ))}
                </div>
            )}

            <div className="w-full px-28">
                <div className="flex justify-between items-center py-10">
                    <h2 className="text-4xl font-bold">ĐIỂM MẶT MÓN HOT</h2>
                    <Link
                        className="text-black hover:text-yellow-400 transition flex items-center"
                        to="/products?category=all"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </div>
                {loadingProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorProducts ? (
                    <p className="text-center text-red-500">{errorProducts}</p>
                ) : (
                    <ProductScrollSlider products={products.slice(10, 20)} />
                )}
            </div>

            <div className="py-20">
                {/* Phần này có thể dùng để hiển thị tin tức trong tương lai */}
            </div>
        </div>
    );
}

export default Home;
