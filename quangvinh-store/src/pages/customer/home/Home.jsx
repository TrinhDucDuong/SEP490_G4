import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { useFetchProducts } from "../../../hooks/customer/useFetchProducts.js";
import { useFetchBrands } from "../../../hooks/customer/useFetchBrands.js";
import { useFetchCategories } from "../../../hooks/customer/useFetchCategories.js";
import { useFetchTotalSoldOutProducts } from "../../../hooks/customer/useFetchTotalSoldOutProducts.js";

import Carousel from "../../../components/ui/home/Carousel.jsx";
import BrandSlider from "../../../components/ui/home/BrandSlider.jsx";
import ProductScrollSlider from "../../../components/ui/product/common/ProductScrollSlider.jsx";
import NewsHome from "../../../components/ui/home/NewsHome.jsx";
import ChatBoxAI from "../common/ChatBoxAI.jsx";
import MessengerChatBubble from "../common/MessengerChatBubble.jsx";

function Home() {
    const { products = [], loading: loadingProducts, error: errorProducts } = useFetchProducts({ limit: 10 });
    const { brands = [], loading: loadingBrands, error: errorBrands } = useFetchBrands({ limit: 10 });
    const { categories = [], loading: loadingCategories, error: errorCategories } = useFetchCategories({ limit: 3 });
    const { productTotal: totalSoldoutProducts = [], loadingTotal: loadingTotalSoldoutProducts, errorTotal: errorTotalSoldOutProduct } = useFetchTotalSoldOutProducts({ limit: 10 });

    const topBrands = useMemo(() => brands.slice(0, 10), [brands]);
    const trendingProducts = useMemo(() => products.slice(0, 10), [products]);
    const hotProducts = useMemo(() => totalSoldoutProducts.slice(0, 10), [totalSoldoutProducts]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <main className="bg-[#F2F2EE] text-black">
            <section aria-label="Hình ảnh quảng cáo nổi bật">
                <Carousel />
            </section>
            <section

                className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-black"
                aria-label="Thương hiệu nổi bật"
            >
                {loadingBrands ? (
                    <p className="text-center text-white py-4 text-xs sm:text-sm md:text-base">Đang tải thương hiệu...</p>
                ) : errorBrands ? (
                    <p className="text-center text-red-500 py-4 text-xs sm:text-sm md:text-base">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>

                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <BrandSlider brands={topBrands} />
                    </motion.div>
                )}
            </section>
            <section

                className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
                aria-label="Sản phẩm xu hướng"
            >
                <header className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 md:py-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-0">ĐÓN ĐẦU XU HƯỚNG</h1>
                    <Link
                        to="/products"
                        className="text-black hover:text-yellow-400 transition flex items-center text-xs sm:text-sm md:text-base p-2"

                        aria-label="Xem tất cả sản phẩm xu hướng"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </header>
                {loadingProducts ? (
                    <p className="text-center text-xs sm:text-sm md:text-base">Đang tải sản phẩm...</p>
                ) : errorProducts ? (
                    <p className="text-center text-red-500 text-xs sm:text-sm md:text-base">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>

                ) : (
                    <ProductScrollSlider products={trendingProducts} />
                )}
            </section>
            {!loadingCategories && !errorCategories && categories.length > 0 && (
                <section

                    className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6 md:py-8 flex flex-col gap-4 sm:gap-6 md:gap-8"

                    aria-label="Danh mục sản phẩm"
                >
                    {categories.slice(0, 4).map((category) => (
                        <Link
                            key={category.categoryId}
                            to={`/products?brandIds=${category.categoryId}`}
                            className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px] overflow-hidden shadow-md rounded-lg group relative"

                            aria-label={`Xem sản phẩm trong danh mục ${category.categoryName}`}
                        >
                            <img
                                src={category.images?.[0]?.imageUrl || "https://yourwebsite.com/images/placeholder.jpg"}
                                alt={`Hình ảnh danh mục ${category.categoryName}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center px-2">

                                    {category.categoryName}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </section>
            )}
            <section
                className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
                aria-label="Sản phẩm hot"
            >
                <header className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 md:py-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-0">ĐIỂM MẶT MÓN HOT</h2>
                    <Link
                        to="/products"
                        className="text-black hover:text-yellow-400 transition flex items-center text-xs sm:text-sm md:text-base p-2"
                        aria-label="Xem tất cả sản phẩm hot"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </header>
                {loadingTotalSoldoutProducts ? (
                    <p className="text-center text-xs sm:text-sm md:text-base">Đang tải sản phẩm...</p>
                ) : errorTotalSoldOutProduct ? (
                    <p className="text-center text-red-500 text-xs sm:text-sm md:text-base">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                ) : (
                    <ProductScrollSlider products={hotProducts} />
                )}
            </section>
            <section
                className="py-4 sm:py-6 md:py-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
                aria-label="Tin tức nổi bật"
            >
                <NewsHome />
            </section>
            <div className="fixed bottom-20 sm:bottom-20 right-4 sm:right-6 z-50 flex flex-row items-end gap-6">
                <MessengerChatBubble />
            </div>
            <div className="fixed bottom-2 sm:bottom-2 right-4 sm:right-6 z-50 flex flex-row items-end gap-2">
                <ChatBoxAI />
            </div>
        </main>
    );
}

export default Home;