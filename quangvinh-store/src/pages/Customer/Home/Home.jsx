import React, {useEffect, useMemo} from "react";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { useFetchProducts } from "../../../hooks/Customer/useFetchProducts.js";
import { useFetchBrands } from "../../../hooks/Customer/useFetchBrands.js";
import { useFetchCategories } from "../../../hooks/Customer/useFetchCategories.js";
import { useFetchTotalSoldOutProducts } from "../../../hooks/Customer/useFetchTotalSoldOutProducts.js";

import Carousel from "../../../components/ui/home/Carousel.jsx";
import BrandSlider from "../../../components/ui/home/BrandSlider.jsx";
import ProductScrollSlider from "../../../components/ui/product/Common/ProductScrollSlider.jsx";
import NewsHome from "../../../components/ui/home/NewsHome.jsx";
import ChatBoxAI from "../Common/chatBoxAI.jsx";
import MessengerChatBubble from "../Common/MessengerChatBubble.jsx";

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
            <section className="w-full px-40 bg-black" aria-label="Thương hiệu nổi bật">
                {loadingBrands ? (
                    <p className="text-center text-white py-4">Đang tải thương hiệu...</p>
                ) : errorBrands ? (
                    <p className="text-center text-red-500 py-4">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
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
            <section className="w-full px-28" aria-label="Sản phẩm xu hướng">
                <header className="flex justify-between items-center py-10">
                    <h1 className="text-4xl font-bold">ĐÓN ĐẦU XU HƯỚNG</h1>
                    <Link
                        to="/products"
                        className="text-black hover:text-yellow-400 transition flex items-center"
                        aria-label="Xem tất cả sản phẩm xu hướng"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </header>
                {loadingProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorProducts ? (
                    <p className="text-center text-red-500">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                ) : (
                    <ProductScrollSlider products={trendingProducts} />
                )}
            </section>
            {!loadingCategories && !errorCategories && categories.length > 0 && (
                <section className="px-28 py-10 flex flex-col gap-8" aria-label="Danh mục sản phẩm">
                    {categories.slice(0, 4).map((category) => (
                        <Link
                            key={category.categoryId}
                            to={`/products?brandIds=${category.categoryId}`}
                            className="w-full h-[500px] overflow-hidden shadow-md rounded-lg group relative"
                            aria-label={`Xem sản phẩm trong danh mục ${category.categoryName}`}
                        >
                            <img
                                src={category.images?.[0]?.imageUrl || "https://yourwebsite.com/images/placeholder.jpg"}
                                alt={`Hình ảnh danh mục ${category.categoryName}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <h2 className="text-white text-2xl font-bold">{category.categoryName}</h2>
                            </div>
                        </Link>
                    ))}
                </section>
            )}
            <section className="w-full px-28" aria-label="Sản phẩm hot">
                <header className="flex justify-between items-center py-10">
                    <h2 className="text-4xl font-bold">ĐIỂM MẶT MÓN HOT</h2>
                    <Link
                        to="/products"
                        className="text-black hover:text-yellow-400 transition flex items-center"
                        aria-label="Xem tất cả sản phẩm hot"
                    >
                        Xem thêm <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                    </Link>
                </header>
                {loadingTotalSoldoutProducts ? (
                    <p className="text-center">Đang tải sản phẩm...</p>
                ) : errorTotalSoldOutProduct ? (
                    <p className="text-center text-red-500">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                ) : (
                    <ProductScrollSlider products={hotProducts} />
                )}
            </section>
            <section className="py-10 w-full px-28" aria-label="Tin tức nổi bật">
                <NewsHome />
            </section>
            <div className="fixed bottom-24 right-6 z-50 flex flex-row items-end gap-4">
                <MessengerChatBubble />
            </div>
            <div className="fixed bottom-6 right-6 z-50 flex flex-row items-end gap-4">
                <ChatBoxAI />
            </div>
        </main>
    );
}

export default Home;
