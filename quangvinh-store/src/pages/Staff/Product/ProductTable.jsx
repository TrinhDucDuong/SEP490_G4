import React, { useState } from 'react';
import { Eye, Edit, Trash2, Image, Plus } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';

import Modal from '../../../components/common/Admin/Modals.jsx';
import Pagination from '../../../components/common/Admin/Paginations.jsx';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Import constants từ file tập trung
import {
    PRODUCT_COLOR_OPTIONS,
    PRODUCT_SIZE_OPTIONS,
    PRODUCT_BRAND_OPTIONS,
    PRODUCT_HELPERS,
    PRODUCT_DEFAULTS
} from '../../../utils/constants';

const ProductTable = ({
                          products,
                          currentPage,
                          setCurrentPage,
                          itemsPerPage,
                          onCreateProduct,
                          onUpdateProduct,
                          onDeleteProduct,
                          loading
                      }) => {
    // Modal states
    const [showImageModal, setShowImageModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form states - Sử dụng defaults từ constants với brand và category
    const [newProduct, setNewProduct] = useState({
        ...PRODUCT_DEFAULTS.NEW_PRODUCT,
        brand: '',
        category: '',
        brandId: null,
        categoryId: null
    });
    const [updateProduct, setUpdateProduct] = useState(null);

    // Sử dụng constants thay vì hardcode
    const colorOptions = PRODUCT_COLOR_OPTIONS;
    const sizeOptions = PRODUCT_SIZE_OPTIONS;
    const brandOptions = PRODUCT_BRAND_OPTIONS;

    // Category options (có thể lấy từ API sau)
    const categoryOptions = [
        { id: 1, name: 'Áo' },
        { id: 2, name: 'Quần' },
        { id: 3, name: 'Giày' },
        { id: 4, name: 'Phụ kiện' },
        { id: 5, name: 'Túi xách' },
        { id: 6, name: 'Mũ nón' },
        { id: 7, name: 'Đồ lót' }
    ];

    // Sử dụng helper functions từ constants
    const formatPriceInput = PRODUCT_HELPERS.formatPrice;
    const parsePriceInput = PRODUCT_HELPERS.parsePrice;

    const handlePriceChange = (e, isUpdate = false) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9.]/g, '');
        const parsedValue = parsePriceInput(numericValue);

        if (isUpdate) {
            setUpdateProduct({ ...updateProduct, price: parsedValue });
        } else {
            setNewProduct({ ...newProduct, price: parsedValue });
        }
    };

    // File upload handlers
    const handleFileUpload = (file, isUpdate = false, index = null, isCover = false) => {
        if (!file) return;

        // Lưu trực tiếp File object thay vì convert sang base64
        if (isUpdate) {
            if (isCover) {
                setUpdateProduct(prev => ({ ...prev, coverImage: file }));
            } else {
                const newImages = [...updateProduct.productImages];
                newImages[index] = file;
                setUpdateProduct(prev => ({ ...prev, productImages: newImages }));
            }
        } else {
            if (isCover) {
                setNewProduct(prev => ({ ...prev, coverImage: file }));
            } else {
                const newImages = [...newProduct.productImages];
                newImages[index] = file;
                setNewProduct(prev => ({ ...prev, productImages: newImages }));
            }
        }
    };

    // Variant management
    const addVariant = (isUpdate = false) => {
        const product = isUpdate ? updateProduct : newProduct;
        const setProduct = isUpdate ? setUpdateProduct : setNewProduct;

        const newVariants = [...(product.variants || []), {
            ...PRODUCT_DEFAULTS.NEW_VARIANT,
            code: `BT${String(Date.now()).slice(-3)}${String(product.variants.length + 1).padStart(2, '0')}`
        }];

        setProduct({ ...product, variants: newVariants });
    };

    const removeVariant = (index, isUpdate = false) => {
        const product = isUpdate ? updateProduct : newProduct;
        const setProduct = isUpdate ? setUpdateProduct : setNewProduct;

        const newVariants = product.variants.filter((_, i) => i !== index);
        setProduct({ ...product, variants: newVariants });
    };

    const updateVariant = (index, field, value, isUpdate = false) => {
        const product = isUpdate ? updateProduct : newProduct;
        const setProduct = isUpdate ? setUpdateProduct : setNewProduct;

        const newVariants = [...product.variants];
        newVariants[index][field] = field === 'quantity' ? Number(value) || 0 : value;

        setProduct({ ...product, variants: newVariants });
    };

    // Modal handlers
    const openAddModal = () => {
        setNewProduct({
            ...PRODUCT_DEFAULTS.NEW_PRODUCT,
            brand: '',
            category: '',
            brandId: null,
            categoryId: null
        });
        setShowAddModal(true);
    };

    const openUpdateModal = (product) => {
        setUpdateProduct({
            ...product,
            brand: product.brand || '',
            category: product.category || '',
            brandId: product.brandId || null,
            categoryId: product.categoryId || null,
            productImages: [...(product.productImages || []), ...Array(6 - (product.productImages?.length || 0)).fill(null)]
        });
        setShowUpdateModal(true);
    };

    const openImageModal = (product) => {
        setSelectedProduct(product);
        setShowImageModal(true);
    };

    const openDetailModal = (product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const openStatusModal = (product) => {
        setSelectedProduct(product);
        setShowStatusModal(true);
    };

    // CRUD operations
    const handleAddProduct = async () => {
        if (!newProduct.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm');
            return;
        }

        if (!newProduct.brand) {
            alert('Vui lòng chọn thương hiệu');
            return;
        }

        if (!newProduct.category) {
            alert('Vui lòng chọn danh mục');
            return;
        }

        // Validation với helper functions
        try {
            newProduct.variants.forEach(variant => {
                if (!PRODUCT_HELPERS.isValidColor(variant.color)) {
                    throw new Error(`Màu sắc không hợp lệ: ${variant.color}`);
                }
                if (!PRODUCT_HELPERS.isValidSize(variant.size)) {
                    throw new Error(`Kích thước không hợp lệ: ${variant.size}`);
                }
            });
        } catch (error) {
            alert(`Lỗi validation: ${error.message}`);
            return;
        }

        // Tạo array images từ coverImage và productImages
        const images = [];
        if (newProduct.coverImage) images.push(newProduct.coverImage);
        newProduct.productImages.forEach(img => {
            if (img) images.push(img);
        });

        console.log('Sending product data:', newProduct);
        console.log('Sending images:', images);

        const result = await onCreateProduct(newProduct, images);

        if (result.success) {
            setShowAddModal(false);
            alert('Tạo sản phẩm thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateProduct = async () => {
        if (!updateProduct.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm');
            return;
        }

        if (!updateProduct.brand) {
            alert('Vui lòng chọn thương hiệu');
            return;
        }

        if (!updateProduct.category) {
            alert('Vui lòng chọn danh mục');
            return;
        }

        // Tạo array images từ coverImage và productImages
        const images = [];
        if (updateProduct.coverImage) images.push(updateProduct.coverImage);
        updateProduct.productImages.forEach(img => {
            if (img) images.push(img);
        });

        console.log('Updating product data:', updateProduct);
        console.log('Updating images:', images);

        const result = await onUpdateProduct(updateProduct.id, updateProduct, images);

        if (result.success) {
            setShowUpdateModal(false);
            alert('Cập nhật sản phẩm thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedProduct) return;

        const result = await onDeleteProduct(selectedProduct.id);

        if (result.success) {
            setShowStatusModal(false);
            alert('Thay đổi trạng thái thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Sử dụng helper function từ constants
    const getStatusColor = (status) => {
        return PRODUCT_HELPERS.getStatusColorClass(status);
    };

    // Table columns configuration
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (product, index) => (
                <span className="font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            )
        },
        {
            key: 'coverImage',
            header: 'Hình ảnh',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (product) => (
                <div className="flex justify-center">
                    <img
                        src={product.coverImage || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openImageModal(product)}
                    />
                </div>
            )
        },
        {
            key: 'name',
            header: 'Tên sản phẩm',
            render: (product) => (
                <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.code}</p>
                </div>
            )
        },
        {
            key: 'price',
            header: 'Giá',
            headerAlign: 'text-right',
            cellAlign: 'text-right',
            render: (product) => (
                <span className="font-medium text-blue-600">
                    {formatPriceInput(product.price)} VNĐ
                </span>
            )
        },
        {
            key: 'brand',
            header: 'Thương hiệu',
            render: (product) => (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {product.brand}
                </span>
            )
        },
        {
            key: 'quantity',
            header: 'Số lượng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (product) => (
                <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.quantity}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (product) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (product) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => openImageModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem hình ảnh"
                    >
                        <Image className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => openDetailModal(product)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => openUpdateModal(product)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => openStatusModal(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Thay đổi trạng thái"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    // Pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);


    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h2>
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={currentProducts}
                loading={loading}
                emptyMessage="Không có sản phẩm nào"
                className="min-h-[400px]"
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={products.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        itemName="sản phẩm"
                    />
                </div>
            )}

            {/* Add Product Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Thêm sản phẩm mới"
                size="xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                            <input
                                type="text"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên sản phẩm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá *</label>
                            <input
                                type="text"
                                value={formatPriceInput(newProduct.price)}
                                onChange={(e) => handlePriceChange(e, false)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập giá sản phẩm"
                            />
                        </div>

                        {/* ✅ THÊM: Brand Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu *</label>
                            <select
                                value={newProduct.brand}
                                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn thương hiệu</option>
                                {brandOptions.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* ✅ THÊM: Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                            <select
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn danh mục</option>
                                {categoryOptions.map(category => (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newProduct.description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewProduct({ ...newProduct, description: data });
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh đại diện</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0], false, null, true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {newProduct.productImages.map((image, index) => (
                                <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0], false, index, false)}
                                        className="w-full text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">Biến thể sản phẩm</label>
                            <button
                                type="button"
                                onClick={() => addVariant(false)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Thêm biến thể
                            </button>
                        </div>

                        {newProduct.variants && newProduct.variants.length > 0 ? (
                            <div className="space-y-4">
                                {newProduct.variants.map((variant, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-900">Biến thể {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index, false)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                                                <select
                                                    value={variant.color}
                                                    onChange={(e) => updateVariant(index, 'color', e.target.value, false)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Chọn màu sắc</option>
                                                    {colorOptions.map(color => (
                                                        <option key={color.hex} value={color.hex}>{color.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                                                <select
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(index, 'size', e.target.value, false)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Chọn kích thước</option>
                                                    {sizeOptions.map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variant.quantity}
                                                    onChange={(e) => updateVariant(index, 'quantity', e.target.value, false)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Update Product Modal */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật sản phẩm"
                size="xl"
            >
                {updateProduct && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                                <input
                                    type="text"
                                    value={updateProduct.name}
                                    onChange={(e) => setUpdateProduct({ ...updateProduct, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập tên sản phẩm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Giá *</label>
                                <input
                                    type="text"
                                    value={formatPriceInput(updateProduct.price)}
                                    onChange={(e) => handlePriceChange(e, true)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập giá sản phẩm"
                                />
                            </div>

                            {/* ✅ THÊM: Brand Selection cho Update */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu *</label>
                                <select
                                    value={updateProduct.brand}
                                    onChange={(e) => setUpdateProduct({ ...updateProduct, brand: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brandOptions.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ✅ THÊM: Category Selection cho Update */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                                <select
                                    value={updateProduct.category}
                                    onChange={(e) => setUpdateProduct({ ...updateProduct, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categoryOptions.map(category => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={updateProduct.description}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setUpdateProduct({ ...updateProduct, description: data });
                                }}
                            />
                        </div>

                        {/* ✅ THÊM: Variants section cho Update */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">Biến thể sản phẩm</label>
                                <button
                                    type="button"
                                    onClick={() => addVariant(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Thêm biến thể
                                </button>
                            </div>

                            {updateProduct.variants && updateProduct.variants.length > 0 ? (
                                <div className="space-y-4">
                                    {updateProduct.variants.map((variant, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-medium text-gray-900">Biến thể {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index, true)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                                                    <select
                                                        value={variant.color}
                                                        onChange={(e) => updateVariant(index, 'color', e.target.value, true)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Chọn màu sắc</option>
                                                        {colorOptions.map(color => (
                                                            <option key={color.hex} value={color.hex}>{color.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                                                    <select
                                                        value={variant.size}
                                                        onChange={(e) => updateVariant(index, 'size', e.target.value, true)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Chọn kích thước</option>
                                                        {sizeOptions.map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.quantity}
                                                        onChange={(e) => updateVariant(index, 'quantity', e.target.value, true)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateProduct}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Status Change Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Thay đổi trạng thái sản phẩm"
                size="md"
            >
                {selectedProduct && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {selectedProduct.status === 'Đang bán' ? 'Ngừng bán sản phẩm' : 'Kích hoạt lại sản phẩm'}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Bạn có chắc chắn muốn {selectedProduct.status === 'Đang bán' ? 'ngừng bán' : 'kích hoạt lại'} sản phẩm "{selectedProduct.name}"?
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleStatusChange}
                                disabled={loading}
                                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                                    selectedProduct.status === 'Đang bán'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {loading ? 'Đang xử lý...' : (selectedProduct.status === 'Đang bán' ? 'Ngừng bán' : 'Kích hoạt')}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Image Modal */}
            <Modal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                title="Danh sách hình ảnh sản phẩm"
                size="xl"
            >
                {selectedProduct && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(selectedProduct.productImages || []).map((image, index) => (
                            <div key={index} className="aspect-square">
                                <img
                                    src={image || '/placeholder-image.jpg'}
                                    alt={`${selectedProduct.name} - ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Chi tiết sản phẩm"
                size="xl"
            >
                {selectedProduct && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={selectedProduct.coverImage || '/placeholder-image.jpg'}
                                    alt={selectedProduct.name}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.code}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Giá</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatPriceInput(selectedProduct.price)} VNĐ</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.brand}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.quantity}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}>
                                        {selectedProduct.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Biến thể sản phẩm</label>
                            {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã biến thể</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedProduct.variants.map((variant, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                                            style={{ backgroundColor: variant.color }}
                                                        />
                                                        {PRODUCT_HELPERS.getColorName(variant.color)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.size}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.quantity}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Không có biến thể nào</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductTable;
