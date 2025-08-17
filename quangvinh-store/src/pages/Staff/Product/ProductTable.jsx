// src/pages/Staff/Product/ProductTable.jsx
import React, { useState } from 'react';
import { Edit, Trash2, Plus, Eye, Package, ImageIcon, AlertCircle, X, Power, PowerOff } from 'lucide-react';
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
                          onViewProduct,
                          loading
                      }) => {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [isStatusToggleDialogOpen, setIsStatusToggleDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    // Calculate pagination
    const safeProducts = Array.isArray(products) ? products : [];
    const safeItemsPerPage = Number(itemsPerPage) || 10;
    const safeCurrentPage = Number(currentPage) || 1;
    const totalPages = Math.ceil(safeProducts.length / safeItemsPerPage);
    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = Math.min(startIndex + safeItemsPerPage, safeProducts.length);
    const currentProducts = safeProducts.slice(startIndex, endIndex);

    // Handle actions
    const handleCreate = () => {
        setSelectedProduct(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = async (product) => {
        setViewLoading(true);
        const result = await onViewProduct(product.productId);
        setViewLoading(false);
        if (result.success) {
            setSelectedProduct(result.data);
            setIsEditModalOpen(true);
        } else {
            alert(result.error || 'Không lấy được thông tin sản phẩm!');
        }
    };

    const handleView = async (product) => {
        setViewLoading(true);
        try {
            const result = await onViewProduct(product.productId);
            if (result.success) {
                setSelectedProduct(result.data);
                setIsViewModalOpen(true);
            } else {
                alert(result.error || 'Có lỗi xảy ra khi lấy thông tin sản phẩm');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi lấy thông tin sản phẩm');
        } finally {
            setViewLoading(false);
        }
    };

    const handleViewImages = (product) => {
        setSelectedProduct(product);
        setIsImageModalOpen(true);
    };

    const handleViewDescription = (product) => {
        setSelectedProduct(product);
        setIsDescriptionModalOpen(true);
    };

    // Handle toggle status button click
    const handleToggleStatusClick = (product) => {
        setSelectedProduct(product);
        setIsStatusToggleDialogOpen(true);
    };

    // Handle confirm toggle status
    const handleConfirmToggleStatus = async () => {
        if (selectedProduct) {
            setToggleLoading(true);
            try {
                const result = await onDeleteProduct(selectedProduct.productId);
                if (result.success) {
                    setIsStatusToggleDialogOpen(false);
                    setSelectedProduct(null);
                } else {
                    alert(result.error || 'Có lỗi xảy ra khi thay đổi trạng thái sản phẩm');
                }
            } catch (error) {
                alert('Có lỗi xảy ra khi thay đổi trạng thái sản phẩm');
            } finally {
                setToggleLoading(false);
            }
        }
    };

    const handleCancelToggleStatus = () => {
        setIsStatusToggleDialogOpen(false);
        setSelectedProduct(null);
    };

    // Get brand name
    const getBrandName = (product) => {
        if (product.brand && product.brand.brandName) {
            return String(product.brand.brandName);
        }
        if (product.brandId && brands && Array.isArray(brands)) {
            const brand = brands.find(b => b.brandId === parseInt(product.brandId));
            if (brand) {
                return String(brand.brandName);
            }
        }
        return '';
    };

    // Get category name
    const getCategoryName = (product) => {
        if (product.category && product.category.categoryName) {
            return String(product.category.categoryName);
        }
        if (product.categoryId && categories && Array.isArray(categories)) {
            const category = categories.find(c => c.categoryId === parseInt(product.categoryId));
            if (category) {
                return String(category.categoryName);
            }
        }
        return '';
    };

    // Render product images
    const renderImages = (product) => {
        if (PRODUCT_HELPERS.hasImages(product)) {
            const firstImage = PRODUCT_HELPERS.getFirstImageUrl(product);
            return (
                <div className="flex items-center justify-center">
                    <img
                        src={firstImage}
                        alt={String(product.productName || '')}
                        className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleViewImages(product)}
                    />
                </div>
            );
        }
        return (
            <div className="flex items-center justify-center">
                <div
                    className="w-12 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleViewImages(product)}
                >
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Danh sách sản phẩm</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Hiển thị {startIndex + 1} - {endIndex} trong tổng số {safeProducts.length} sản phẩm
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh sản phẩm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả sản phẩm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá sản phẩm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                Không có sản phẩm nào
                            </td>
                        </tr>
                    ) : (
                        currentProducts.map((product, index) => {
                            const brandName = getBrandName(product);
                            const categoryName = getCategoryName(product);

                            return (
                                <tr key={product.productId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {String(product.productName || '')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderImages(product)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {brandName || (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {categoryName || (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleViewDescription(product)}
                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                        >
                                            Xem mô tả
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.unitPrice ? PRODUCT_HELPERS.formatPrice(product.unitPrice) : '0'} VNĐ
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col space-y-2">
                                            {/* Hàng đầu: Eye + Edit */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleView(product)}
                                                    disabled={viewLoading}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {/* Hàng thứ hai: Status toggle theo ảnh */}
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleToggleStatusClick(product)}
                                                    disabled={toggleLoading}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                                                        product.isActive
                                                            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                                                    }`}
                                                    title={product.isActive ? 'Ngừng bán' : 'Kích hoạt bán'}
                                                >
                                                    {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modals */}
            <ProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={onCreateProduct}
                brands={brands}
                categories={categories}
                colors={colors}
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
                colors={colors}
                brands={brands}
                categories={categories}
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

            {/* Status Toggle Confirmation Dialog */}
            {isStatusToggleDialogOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                                selectedProduct?.isActive ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                                {selectedProduct?.isActive ? (
                                    <PowerOff className="h-6 w-6 text-red-600" />
                                ) : (
                                    <Power className="h-6 w-6 text-green-600" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-2">
                                {selectedProduct?.isActive ? 'Ngừng bán sản phẩm' : 'Kích hoạt bán sản phẩm'}
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Bạn có muốn {selectedProduct?.isActive ? 'ngừng bán' : 'kích hoạt bán'} sản phẩm{' '}
                                    <span className="font-medium">"{String(selectedProduct?.productName || '')}"</span> không?
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {selectedProduct?.isActive
                                        ? 'Sản phẩm sẽ chuyển sang trạng thái ngừng bán.'
                                        : 'Sản phẩm sẽ chuyển sang trạng thái đang bán.'
                                    }
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleConfirmToggleStatus}
                                    disabled={toggleLoading}
                                    className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 mr-2 transition-colors ${
                                        selectedProduct?.isActive
                                            ? 'bg-red-500 hover:bg-red-600 disabled:opacity-50'
                                            : 'bg-green-500 hover:bg-green-600 disabled:opacity-50'
                                    }`}
                                >
                                    {toggleLoading ? 'Đang xử lý...' : 'Có'}
                                </button>
                                <button
                                    onClick={handleCancelToggleStatus}
                                    disabled={toggleLoading}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600"
                                >
                                    Không
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
