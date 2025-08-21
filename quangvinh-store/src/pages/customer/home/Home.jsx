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
                className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-40 bg-black"
                aria-label="Thương hiệu nổi bật"
            >
                {loadingBrands ? (
                    <p className="text-center text-white py-4 text-sm sm:text-base">Đang tải thương hiệu...</p>
                ) : errorBrands ? (
                    <p className="text-center text-red-500 py-4 text-sm sm:text-base">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
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
                className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-28"
                aria-label="Sản phẩm xu hướng"
            >
                <header className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-8 md:py-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-0">ĐÓN ĐẦU XU HƯỚNG</h1>
                    <Link
                        to="/products"
                        className="text-black hover:text-yellow-400 transition flex items-center text-sm sm:text-base"
                        aria-label="Xem tất cả sản phẩm xu hướng"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </header>
                {loadingProducts ? (
                    <p className="text-center text-sm sm:text-base">Đang tải sản phẩm...</p>
                ) : errorProducts ? (
                    <p className="text-center text-red-500 text-sm sm:text-base">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                ) : (
                    <ProductScrollSlider products={trendingProducts} />
                )}
            </section>
            {!loadingCategories && !errorCategories && categories.length > 0 && (
                <section
                    className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-28 py-6 sm:py-8 md:py-10 flex flex-col gap-4 sm:gap-6 md:gap-8"
                    aria-label="Danh mục sản phẩm"
                >
                    {categories.slice(0, 4).map((category) => (
                        <Link
                            key={category.categoryId}
                            to={`/products?brandIds=${category.categoryId}`}
                            className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden shadow-md rounded-lg group relative"
                            aria-label={`Xem sản phẩm trong danh mục ${category.categoryName}`}
                        >
                            <img
                                src={category.images?.[0]?.imageUrl || "https://yourwebsite.com/images/placeholder.jpg"}
                                alt={`Hình ảnh danh mục ${category.categoryName}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center">
                                    {category.categoryName}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </section>
            )}
            <section
                className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-28"
                aria-label="Sản phẩm hot"
            >
                <header className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-8 md:py-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-0">ĐIỂM MẶT MÓN HOT</h2>
                    <Link
                        to="/products"
                        className="text-black hover:text-yellow-400 transition flex items-center text-sm sm:text-base"
                        aria-label="Xem tất cả sản phẩm hot"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </header>
                {loadingTotalSoldoutProducts ? (
                    <p className="text-center text-sm sm:text-base">Đang tải sản phẩm...</p>
                ) : errorTotalSoldOutProduct ? (
                    <p className="text-center text-red-500 text-sm sm:text-base">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                ) : (
                    <ProductScrollSlider products={hotProducts} />
                )}
            </section>
            <section
                className="py-6 sm:py-8 md:py-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-28"
                aria-label="Tin tức nổi bật"
            >
                <NewsHome />
            </section>
            <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-50 flex flex-row items-end gap-2 sm:gap-4">
                <MessengerChatBubble />
            </div>
            <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-row items-end gap-2 sm:gap-4">
                <ChatBoxAI />
            </div>
        </main>
    );
}

export default Home;