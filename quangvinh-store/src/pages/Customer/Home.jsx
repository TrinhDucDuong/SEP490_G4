import { Link } from "react-router-dom";
import Carousel from '../../components/ui/home/Carousel.jsx';
import CategorySlider from '../../components/ui/home/CategorySlider.jsx';
import { useFetchCategories, useFetchProducts } from "../../hooks/useFetch.js";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductScrollSlider from "../../components/ui/product/ProductScrollSlider.jsx";
import CategoryBanner from "../../components/ui/home/CategoryBanner.jsx";

function Home() {
    const { categories, loading, error } = useFetchCategories();
    const { products, loading: loadingProducts, error: errorProducts } = useFetchProducts();

    return (
        <div className="bg-[#F2F2EE] text-black">
            <Carousel />
            <div className="w-full px-40 bg-black">
                {loading ? (
                    <p className="text-center text-white py-4">Đang tải danh mục...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error}</p>
                ) : (
                    <CategorySlider categories={categories.slice(0, 10)} />
                )}
            </div>
            <div className="w-full px-28 ">
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
            {!loading && !error && (
                <div className="px-28 py-10 space-y-8">
                    {categories.slice(0, 3).map((category, index) => (
                        <CategoryBanner key={index} categories={category} />
                    ))}
                </div>
            )}
            <div className="w-full px-28 ">
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
        </div>
    );
}

export default Home;
