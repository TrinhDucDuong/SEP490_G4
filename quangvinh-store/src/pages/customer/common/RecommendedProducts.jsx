/**
 * @file RecommendedProductList.jsx
 * @description Component hiển thị danh sách sản phẩm được đề xuất cho khách hàng.
 * - Sử dụng hook `useFetchRecommendation` để lấy dữ liệu sản phẩm đề xuất từ API.
 * - Hiển thị loading message khi đang tải dữ liệu.
 * - Sử dụng `ProductScrollSlider` để hiển thị sản phẩm dạng slider ngang, tối đa 10 sản phẩm.
 * @author ngothangwork
 * @copyright 2025 ngothangwork
 */

import React from 'react';
import useFetchRecommendation from "../../../hooks/customer/recommend/useFetchRecommendation.js";
import ProductScrollSlider from "../../../components/ui/product/common/ProductScrollSlider.jsx";

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
