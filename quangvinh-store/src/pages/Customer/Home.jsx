import { Link } from "react-router-dom";
import Carousel from '../../components/ui/home/Carousel.jsx';
import BrandSlider from '../../components/ui/home/BrandSlider.jsx';
import { useFetchProducts } from "../../hooks/useFetchAllProducts.js";
import { useFetchBrands } from "../../hooks/useFetchBrands.js";
import { useFetchCategories } from "../../hooks/useFetchCategories.js";
import { useFetchTotalSoldOutProducts } from "../../hooks/useFetchTotalSoldOutProducts.js";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductScrollSlider from "../../components/ui/product/ProductScrollSlider.jsx";
import Banner from "../../components/ui/home/Banner.jsx";
import { motion } from "framer-motion";

function Home() {
    const { brands, loading: loadingBrands, error: errorBrands } = useFetchBrands();
    const { categories, loading: loadingCategories, error: errorCategories } = useFetchCategories();
    const { products, loading: loadingProducts, error: errorProducts } = useFetchProducts();
    const {
        productTotal: totalSoldoutProducts,
        loadingTotal: loadingTotalSoldoutProducts,
        errorTotal: errorTotalSoldOutProduct
    } = useFetchTotalSoldOutProducts();

    return (
        <div className="bg-[#F2F2EE] text-black">
            <Carousel />

            {/* Thương hiệu */}
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

            {/* Danh mục */}
            {!loadingCategories && !errorCategories && categories.length > 0 && (
                <div className="px-28 py-10 space-y-8">
                    {categories.slice(0, 3).map((category, index) => (
                        <Banner
                            key={index}
                            item={category}
                            link={`/products?category=${encodeURIComponent(
                                category.categoryName?.toLowerCase() || "all"
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
                {loadingTotalSoldoutProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorTotalSoldOutProduct ? (
                    <p className="text-center text-red-500">{errorTotalSoldOutProduct}</p>
                ) : (
                    <ProductScrollSlider products={totalSoldoutProducts.slice(0, 10)} />
                )}
            </div>

            <div className="py-20">
                {/* Tin tức hoặc nội dung thêm ở đây */}
            </div>
        </div>
    );
}

export default Home;
