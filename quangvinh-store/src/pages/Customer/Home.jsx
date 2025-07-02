import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { useFetchProducts } from "../../hooks/useFetchProducts";
import { useFetchBrands } from "../../hooks/useFetchBrands";
import { useFetchCategories } from "../../hooks/useFetchCategories";
import { useFetchTotalSoldOutProducts } from "../../hooks/useFetchTotalSoldOutProducts";
import { useFetchBanners } from "../../hooks/useFetchBanners";

import Carousel from "../../components/ui/home/Carousel";
import BrandSlider from "../../components/ui/home/BrandSlider";
import ProductScrollSlider from "../../components/ui/product/ProductScrollSlider";

function Home() {
    const { products = [], loading: loadingProducts, error: errorProducts } = useFetchProducts();
    const { brands = [], loading: loadingBrands, error: errorBrands } = useFetchBrands();
    const { categories = [], loading: loadingCategories, error: errorCategories } = useFetchCategories();
    const { productTotal: totalSoldoutProducts = [], loadingTotal: loadingTotalSoldoutProducts, errorTotal: errorTotalSoldOutProduct } = useFetchTotalSoldOutProducts();
    const { banners = [], loading: loadingBanner, error: errorBanner } = useFetchBanners();

    const topBrands = useMemo(() => brands.slice(0, 10), [brands]);
    const trendingProducts = useMemo(() => products.slice(0, 10), [products]);
    const hotProducts = useMemo(() => totalSoldoutProducts.slice(0, 10), [totalSoldoutProducts]);

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
                        <BrandSlider brands={topBrands} />
                    </motion.div>
                )}
            </div>
            <div className="w-full px-28">
                <div className="flex justify-between items-center py-10">
                    <h2 className="text-4xl font-bold">ĐÓN ĐẦU XU HƯỚNG</h2>
                    <Link to="/products?category=all" className="text-black hover:text-yellow-400 transition flex items-center">
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </div>
                {loadingProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorProducts ? (
                    <p className="text-center text-red-500">{errorProducts}</p>
                ) : (
                    <ProductScrollSlider products={trendingProducts} />
                )}
            </div>
            {!loadingBanner && !errorBanner && banners.length > 0 && (
                <div className="px-28 py-10 space-y-8">
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className="w-full h-[500px] overflow-hidden shadow-lg"
                        >
                            <img
                                src={banner.imageUrl}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="w-full px-28">
                <div className="flex justify-between items-center py-10">
                    <h2 className="text-4xl font-bold">ĐIỂM MẶT MÓN HOT</h2>
                    <Link to="/products?category=all" className="text-black hover:text-yellow-400 transition flex items-center">
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </div>
                {loadingTotalSoldoutProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorTotalSoldOutProduct ? (
                    <p className="text-center text-red-500">{errorTotalSoldOutProduct}</p>
                ) : (
                    <ProductScrollSlider products={hotProducts} />
                )}
            </div>

            <div className="py-20">{/* Nội dung thêm sau nếu có */}</div>
        </div>
    );
}

export default Home;
