import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { useFetchProducts } from "../../../hooks/useFetchProducts.js";
import { useFetchBrands } from "../../../hooks/useFetchBrands.js";
import { useFetchCategories } from "../../../hooks/useFetchCategories.js";
import { useFetchTotalSoldOutProducts } from "../../../hooks/useFetchTotalSoldOutProducts.js";


import Carousel from "../../../components/ui/home/Carousel.jsx";
import BrandSlider from "../../../components/ui/home/BrandSlider.jsx";
import ProductScrollSlider from "../../../components/ui/product/Common/ProductScrollSlider.jsx";
import NewsHome from "../../../components/ui/home/NewsHome.jsx";
import ChatBoxAI from "../Common/chatBoxAI.jsx";

function Home() {
    const { products = [], loading: loadingProducts, error: errorProducts } = useFetchProducts();
    const { brands = [], loading: loadingBrands, error: errorBrands } = useFetchBrands();
    const { categories = [], loading: loadingCategories, error: errorCategories } = useFetchCategories();
    const { productTotal: totalSoldoutProducts = [], loadingTotal: loadingTotalSoldoutProducts, errorTotal: errorTotalSoldOutProduct } = useFetchTotalSoldOutProducts();

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
            {!loadingCategories && !errorCategories && categories.length > 0 && (
                <div className="px-28 py-10 flex flex-col gap-8">
                    {categories.slice(0, 3).map((category) => (
                        <Link
                            key={category.categoryId}
                            to={`/products?categoryIds=${category.categoryId}`}
                            className="w-full h-[500px] overflow-hidden shadow-md rounded-lg group relative"
                        >
                            <img
                                src={category.images?.[0]?.imageUrl}
                                alt={category.categoryName}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <h3 className="text-white text-2xl font-bold">{category.categoryName}</h3>
                            </div>
                        </Link>
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

            <div className="py-10 w-full px-28">
                <NewsHome/>
            </div>
            <div className="fixed bottom-6 right-6 z-50">
                <ChatBoxAI />
            </div>
        </div>
    );
}

export default Home;
