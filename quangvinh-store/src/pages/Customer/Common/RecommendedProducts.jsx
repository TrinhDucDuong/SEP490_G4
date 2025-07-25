import React from 'react';
import useFetchRecommendation from "../../../hooks/Customer/recommend/useFetchRecommendation.js";
import ProductScrollSlider from "../../../components/ui/product/Common/ProductScrollSlider.jsx";

const RecommendedProductList = () => {
    const { products, loading } = useFetchRecommendation();

    if (loading) return <p>Đang tải đề xuất...</p>;

    return (
        <div className="space-y-2">
            <ProductScrollSlider products={products.slice(0, 10)} />
        </div>
    );
};

export default RecommendedProductList;
