/**
 * @file ProductList.jsx
 * @description Component hiển thị danh sách sản phẩm với chức năng filter, sort và phân trang.
 * Sử dụng các hook custom để lấy dữ liệu từ backend.
 * @author ngothangwork
 * @copyright 2025
 */

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetchCategories } from '../../../hooks/customer/useFetchCategories.js';
import { useFetchFilteredProducts } from '../../../hooks/customer/useFetchFilteredProducts.js';
import ProductFilter from '../../../components/ui/product/filter/ProductFilter.jsx';
import ProductCard from '../../../components/ui/product/common/ProductCard.jsx';
import Pagination from '../../../components/common/customer/Pagination.jsx';
import Banner from "../../../components/ui/home/Banner.jsx";

/**
 * Các tùy chọn sắp xếp sản phẩm
 * @constant
 * @type {Array<{ value: string, label: string }>}
 */
const sortOptions = [
    { value: '', label: 'Mặc định' },
    { value: 'createdDate,DESC', label: 'Mới nhất' },
    { value: 'unitPrice,ASC', label: 'Giá tăng dần' },
    { value: 'unitPrice,DESC', label: 'Giá giảm dần' },
    { value: 'totalSoldOut,DESC', label: 'Bán chạy' },
];

/**
 * Component ProductList
 *
 * @component
 * @returns {JSX.Element} Giao diện danh sách sản phẩm gồm filter, sort, pagination
 *
 * @example
 * return (
 *   <ProductList />
 * )
 */
const ProductList = () => {
    /** Lấy danh sách sản phẩm từ API theo filter */
    const { products, totalItems, loading, error } = useFetchFilteredProducts();

    /** Lấy danh mục sản phẩm để filter */
    const { categories } = useFetchCategories();

    /** Quản lý query params (pageNumber, pageSize, sort, filter...) */
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Cuộn lên đầu trang khi thay đổi route
     */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    /** @type {number} Số trang hiện tại (default = 0) */
    const pageNumber = Number(searchParams.get("pageNumber") || 0);

    /** @type {number} Kích thước trang (default = 20) */
    const pageSize = Number(searchParams.get("pageSize") || 20);

    /** @type {string} Giá trị sort hiện tại (VD: "unitPrice,ASC") */
    const currentSort = searchParams.get("sortBy") && searchParams.get("sortDirection")
        ? `${searchParams.get("sortBy")},${searchParams.get("sortDirection")}`
        : '';

    /**
     * Xử lý thay đổi trang
     * @param {number} newPage - Số trang mới
     */
    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("pageNumber", newPage);
        setSearchParams(newParams);
    };

    /**
     * Xử lý thay đổi sắp xếp
     * @param {React.ChangeEvent<HTMLSelectElement>} e - Sự kiện change từ select box
     */
    const handleSortChange = (e) => {
        const value = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        if (value === '') {
            newParams.delete('sortBy');
            newParams.delete('sortDirection');
        } else {
            const [sortBy, sortDirection] = value.split(',');
            newParams.set('sortBy', sortBy);
            newParams.set('sortDirection', sortDirection);
        }
        newParams.set('pageNumber', 0);
        setSearchParams(newParams);
    };

    return (
        <div className="bg-[#F2F2EE] min-h-screen px-4 sm:px-6 lg:px-20 py-6 md:py-8 ">
            {/* Banner cho trang sản phẩm */}
            <div className="mb-6">
                <Banner
                    item={{
                        title: "",
                        images: [{ imageUrl: "/banner-product.jpg" }]
                    }}
                    link="/products"
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar filter */}
                <aside className="w-full lg:w-1/4">
                    <ProductFilter categories={categories || []} />
                </aside>

                {/* Danh sách sản phẩm */}
                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Danh sách sản phẩm</h2>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            className="w-full sm:w-auto border border-gray-300 rounded-full py-2 px-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Render trạng thái */}
                    {loading ? (
                        <p className="text-center text-gray-500 text-sm">Đang tải sản phẩm...</p>
                    ) : error ? (
                        <p className="text-center text-red-500 text-sm">{error}</p>
                    ) : products.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm">Không tìm thấy sản phẩm phù hợp</p>
                    ) : (
                        <>
                            {/* Grid sản phẩm */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
                                {products.map((product) => (
                                    <ProductCard key={product.productId} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    currentPage={pageNumber}
                                    pageSize={pageSize}
                                    totalItems={totalItems}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductList;
