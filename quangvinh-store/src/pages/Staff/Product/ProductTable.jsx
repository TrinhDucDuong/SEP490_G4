// src/pages/Staff/Product/ProductTable.jsx

import React, { useState } from 'react';
import {
    Edit,
    Trash2,
    Plus,
    Eye,
    Package,
    ImageIcon,
    AlertCircle,
    X
} from 'lucide-react';
import Pagination from '../../../components/common/Admin/Paginations';
import ProductModal from './ProductModal';
import ProductViewModal from './ProductViewModal';
import ProductImageModal from './ProductImageModal';
import ProductDescriptionModal from './ProductDescriptionModal';
import { PRODUCT_HELPERS } from '../../../utils/constants/ProductConstants';

const ProductTable = ({
                          products,
                          colors,
                          brands,
                          categories,
                          currentPage,
                          setCurrentPage,
                          itemsPerPage,
                          onCreateProduct,
                          onUpdateProduct,
                          onDeleteProduct,
                          loading
                      }) => {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Calculate pagination - SỬA LỖI: Đảm bảo không có NaN
    const safeProducts = Array.isArray(products) ? products : [];
    const safeItemsPerPage = Number(itemsPerPage) || 10;
    const safeCurrentPage = Number(currentPage) || 1;

    const totalPages = Math.ceil(safeProducts.length / safeItemsPerPage);
    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = Math.min(startIndex + safeItemsPerPage, safeProducts.length);
    const currentProducts = safeProducts.slice(startIndex, endIndex);

    // Debug pagination values
    console.log('📄 Pagination debug:', {
        totalProducts: safeProducts.length,
        currentPage: safeCurrentPage,
        itemsPerPage: safeItemsPerPage,
        totalPages,
        startIndex,
        endIndex,
        currentProductsCount: currentProducts.length
    });

    // Handle actions
    const handleCreate = () => {
        setSelectedProduct(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (product) => {
        console.log('📝 Editing product with full data:', product);
        setSelectedProduct(product); // product đã có images array
        setIsEditModalOpen(true);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
        setIsViewModalOpen(true);
    };

    const handleViewImages = (product) => {
        setSelectedProduct(product);
        setIsImageModalOpen(true);
    };

    const handleViewDescription = (product) => {
        setSelectedProduct(product);
        setIsDescriptionModalOpen(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            setDeleteLoading(true);
            try {
                const result = await onDeleteProduct(selectedProduct.productId);
                if (result.success) {
                    setIsDeleteDialogOpen(false);
                    setSelectedProduct(null);
                } else {
                    alert(result.error || 'Có lỗi xảy ra khi xóa sản phẩm');
                }
            } catch (error) {
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
    };

    // Get brand name - SỬA: Lấy từ nested object hoặc brandId
    const getBrandName = (product) => {
        console.log('🏷️ Getting brand name for product:', product);

        // Trường hợp 1: Có nested brand object (từ API mới)
        if (product.brand && product.brand.brandName) {
            return String(product.brand.brandName);
        }

        // Trường hợp 2: Chỉ có brandId, tìm trong brands array
        if (product.brandId && brands && Array.isArray(brands)) {
            const brand = brands.find(b => b.brandId === parseInt(product.brandId));
            if (brand) {
                return String(brand.brandName);
            }
        }

        console.log('❌ No brand found for product:', product.productId);
        return '';
    };

    // Get category name - SỬA: Lấy từ nested object hoặc categoryId
    const getCategoryName = (product) => {
        console.log('📂 Getting category name for product:', product);

        // Trường hợp 1: Có nested category object (từ API mới)
        if (product.category && product.category.categoryName) {
            return String(product.category.categoryName);
        }

        // Trường hợp 2: Chỉ có categoryId, tìm trong categories array
        if (product.categoryId && categories && Array.isArray(categories)) {
            const category = categories.find(c => c.categoryId === parseInt(product.categoryId));
            if (category) {
                return String(category.categoryName);
            }
        }

        console.log('❌ No category found for product:', product.productId);
        return '';
    };

    // Render product images
    const renderImages = (product) => {
        if (PRODUCT_HELPERS.hasImages(product)) {
            const firstImage = PRODUCT_HELPERS.getFirstImageUrl(product);
            return (
                <div className="flex justify-center">
                    <button
                        onClick={() => handleViewImages(product)}
                        className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={firstImage}
                            alt={String(product.productName || 'Product image')}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden w-full h-full items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    </button>
                </div>
            );
        }

        return (
            <div className="flex justify-center">
                <button
                    onClick={() => handleViewImages(product)}
                    className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-lg transition-shadow"
                >
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                </button>
            </div>
        );
    };

    // Get status color class
    const getStatusColor = (status) => {
        return status ?
            'bg-green-100 text-green-800 border border-green-200' :
            'bg-red-100 text-red-800 border border-red-200';
    };

    // Get status text
    const getStatusText = (isActive) => {
        return isActive ? 'Đang bán' : 'Đã ngừng bán';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow border">
                <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow border">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Danh sách sản phẩm
                        </h3>
                        <p className="text-sm text-gray-600">
                            Hiển thị {startIndex + 1} - {endIndex} trong tổng số {safeProducts.length} sản phẩm
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên sản phẩm
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hình ảnh sản phẩm
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Brand
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh mục
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mô tả sản phẩm
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thông tin chi tiết sản phẩm
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá sản phẩm
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-12 text-center">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Không có sản phẩm nào</p>
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((product, index) => {
                                // Debug cho từng product
                                const brandName = getBrandName(product);
                                const categoryName = getCategoryName(product);

                                console.log(`🔍 Product ${index + 1} display data:`, {
                                    productId: product.productId,
                                    productName: product.productName,
                                    brandName,
                                    categoryName,
                                    rawBrand: product.brand,
                                    rawCategory: product.category,
                                    rawBrandId: product.brandId,
                                    rawCategoryId: product.categoryId
                                });

                                return (
                                    <tr key={product.productId} className="hover:bg-gray-50">
                                        {/* STT */}
                                        <td className="px-6 py-4 text-center">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {startIndex + index + 1}
                        </span>
                                        </td>

                                        {/* Tên sản phẩm */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {String(product.productName || '')}
                                            </div>
                                        </td>

                                        {/* Hình ảnh */}
                                        <td className="px-6 py-4 text-center">
                                            {renderImages(product)}
                                        </td>

                                        {/* Brand - SỬA: Hiển thị tên brand hoặc dấu gạch ngang */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-center text-gray-700">
                                                {brandName || (
                                                    <span className="text-gray-400 italic">-</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Category - SỬA: Hiển thị tên category hoặc dấu gạch ngang */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-center text-gray-700">
                                                {categoryName || (
                                                    <span className="text-gray-400 italic">-</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Mô tả */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleViewDescription(product)}
                                                className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
                                            >
                                                Mô tả chi tiết
                                            </button>
                                        </td>

                                        {/* Thông tin chi tiết */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleView(product)}
                                                className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600"
                                            >
                                                <Eye className="h-3 w-3 mr-1"/>
                                                Thông tin chi tiết
                                            </button>
                                        </td>

                                        {/* Giá sản phẩm */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-center">
                          <span className="font-semibold text-green-600">
                            {product.unitPrice ? PRODUCT_HELPERS.formatPrice(product.unitPrice) : '0'} VNĐ
                          </span>
                                            </div>
                                        </td>

                                        {/* Hành động */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center space-y-2 min-w-[100px]">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(product);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Cập nhật"
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(product);
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 w-20 ${getStatusColor(product.isActive)}`}
                                                    title="Trạng thái"
                                                >
                                                    {getStatusText(product.isActive)}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - SỬA LỖI: Đảm bảo props không có NaN */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                const newPage = Number(page) || 1;
                                console.log('📄 Page change:', newPage);
                                setCurrentPage(newPage);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Modals - THÊM SAFE PROPS */}
            <ProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={onCreateProduct}
                colors={colors || []}
                brands={brands || []}
                categories={categories || []}
                mode="create"
            />

            <ProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={onUpdateProduct}
                brands={brands}
                categories={categories}
                colors={colors}
                mode="edit"
                initialData={selectedProduct}
            />

            <ProductViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                product={selectedProduct}
                colors={colors || []}
                brands={brands || []}
                categories={categories || []}
            />

            <ProductImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                product={selectedProduct}
            />

            <ProductDescriptionModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                product={selectedProduct}
            />

            {/* Custom Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Xác nhận xóa sản phẩm
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        Bạn có chắc chắn muốn xóa sản phẩm{' '}
                                        <span className="font-medium">"{String(selectedProduct?.productName || '')}"</span>?
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Hành động này sẽ chuyển sản phẩm sang trạng thái không hoạt động.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleteLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductTable;
