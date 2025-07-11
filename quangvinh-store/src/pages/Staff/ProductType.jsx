import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import SidebarForAdmin from '../../components/layout/admin/SidebarForAdmin.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Admin/Modals.jsx';
import Pagination from '../../components/common/Admin/Paginations.jsx';
import SearchBar from '../../components/common/Admin/SearchBar';

import DataTable from '../../components/common/Admin/DataTable';

const ProductType = () => {
    const [productTypes, setProductTypes] = useState([]);
    const [filteredProductTypes, setFilteredProductTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        status: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedProductType, setSelectedProductType] = useState(null);
    const [newProductType, setNewProductType] = useState({ name: '', categoryId: '' });
    const [updateProductType, setUpdateProductType] = useState({ name: '', categoryId: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sample data
    useEffect(() => {
        const sampleCategories = [
            { id: 'DM001', name: 'Đồ thể thao', status: 'Đang bán' },
            { id: 'DM002', name: 'Đồ mùa hè', status: 'Đang bán' },
            { id: 'DM003', name: 'Đồ dạo phố', status: 'Đang bán' },
            { id: 'DM004', name: 'Đồ công sở', status: 'Đã ngưng bán' },
            { id: 'DM005', name: 'Đồ mùa đông', status: 'Đang bán' }
        ];
        setCategories(sampleCategories);

        const sampleProductTypes = [
            {
                id: 'LTP001',
                name: 'Áo thun ngắn tay',
                categoryId: 'DM001',
                categoryName: 'Đồ thể thao',
                status: 'Đang bán'
            },
            {
                id: 'LTP002',
                name: 'Quần short',
                categoryId: 'DM002',
                categoryName: 'Đồ mùa hè',
                status: 'Đang bán'
            },
            {
                id: 'LTP003',
                name: 'Áo sơ mi',
                categoryId: 'DM004',
                categoryName: 'Đồ công sở',
                status: 'Đang bán'
            },
            {
                id: 'LTP004',
                name: 'Quần jean',
                categoryId: 'DM003',
                categoryName: 'Đồ dạo phố',
                status: 'Đã ngưng bán'
            },
            {
                id: 'LTP005',
                name: 'Áo khoác',
                categoryId: 'DM005',
                categoryName: 'Đồ mùa đông',
                status: 'Đang bán'
            },
            {
                id: 'LTP006',
                name: 'Giày thể thao',
                categoryId: 'DM001',
                categoryName: 'Đồ thể thao',
                status: 'Đang bán'
            },
            {
                id: 'LTP007',
                name: 'Quần dài',
                categoryId: 'DM003',
                categoryName: 'Đồ dạo phố',
                status: 'Đang bán'
            },
            {
                id: 'LTP008',
                name: 'Áo dài tay',
                categoryId: 'DM005',
                categoryName: 'Đồ mùa đông',
                status: 'Đang bán'
            }
        ];
        setProductTypes(sampleProductTypes);
        setFilteredProductTypes(sampleProductTypes);
    }, []);

    // Search and filter functionality
    useEffect(() => {
        let result = productTypes;

        // Apply search
        if (searchTerm) {
            result = result.filter(productType =>
                productType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                productType.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                productType.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filters
        if (filters.category) {
            result = result.filter(productType => productType.categoryId === filters.category);
        }

        if (filters.status) {
            result = result.filter(productType => productType.status === filters.status);
        }

        // Apply sorting
        if (sortConfig.key === 'name') {
            result.sort((a, b) => {
                const aValue = a.name.toLowerCase();
                const bValue = b.name.toLowerCase();
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            });
        }

        setFilteredProductTypes(result);
        setCurrentPage(1);
    }, [productTypes, searchTerm, filters, sortConfig]);

    const handleSort = (key) => {
        if (key === 'name') {
            let direction = 'asc';
            if (sortConfig.key === key && sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            setSortConfig({ key, direction });
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({ category: '', status: '' });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    };

    // CRUD operations
    const handleCreate = () => {
        if (newProductType.name.trim() && newProductType.categoryId) {
            const category = categories.find(cat => cat.id === newProductType.categoryId);
            const newItem = {
                id: `LTP${String(productTypes.length + 1).padStart(3, '0')}`,
                name: newProductType.name.trim(),
                categoryId: newProductType.categoryId,
                categoryName: category.name,
                status: 'Đang bán'
            };
            setProductTypes([...productTypes, newItem]);
            setNewProductType({ name: '', categoryId: '' });
            setShowCreateModal(false);
        }
    };

    const handleUpdate = () => {
        if (selectedProductType && updateProductType.name.trim() && updateProductType.categoryId) {
            const category = categories.find(cat => cat.id === updateProductType.categoryId);
            const updatedProductTypes = productTypes.map(productType =>
                productType.id === selectedProductType.id
                    ? {
                        ...productType,
                        name: updateProductType.name.trim(),
                        categoryId: updateProductType.categoryId,
                        categoryName: category.name
                    }
                    : productType
            );
            setProductTypes(updatedProductTypes);
            setShowUpdateModal(false);
            setSelectedProductType(null);
            setUpdateProductType({ name: '', categoryId: '' });
        }
    };

    const handleDelete = () => {
        if (selectedProductType) {
            const updatedProductTypes = productTypes.filter(productType => productType.id !== selectedProductType.id);
            setProductTypes(updatedProductTypes);
            setShowDeleteModal(false);
            setSelectedProductType(null);
        }
    };

    const handleStatusChange = () => {
        if (selectedProductType) {
            const newStatus = selectedProductType.status === 'Đang bán' ? 'Đã ngưng bán' : 'Đang bán';
            const updatedProductTypes = productTypes.map(productType =>
                productType.id === selectedProductType.id
                    ? { ...productType, status: newStatus }
                    : productType
            );
            setProductTypes(updatedProductTypes);
            setShowStatusModal(false);
            setSelectedProductType(null);
        }
    };

    const openCreateModal = () => {
        setNewProductType({ name: '', categoryId: '' });
        setShowCreateModal(true);
    };

    const openUpdateModal = (productType) => {
        setSelectedProductType(productType);
        setUpdateProductType({ name: productType.name, categoryId: productType.categoryId });
        setShowUpdateModal(true);
    };

    const openDeleteModal = (productType) => {
        setSelectedProductType(productType);
        setShowDeleteModal(true);
    };

    const openStatusModal = (productType) => {
        setSelectedProductType(productType);
        setShowStatusModal(true);
    };

    const getStatusColor = (status) => {
        return status === 'Đang bán'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    };

    // Định nghĩa columns cho DataTable
    const columns = [
        {
            key: 'id',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (productType) => (
                <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {productType.id}
                </span>
            ),
            mobileRender: (productType) => (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{productType.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(productType.status)}`}>
                        {productType.status}
                    </span>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Tên Loại Trang Phục',
            render: (productType) => (
                <div className="font-medium text-gray-900">{productType.name}</div>
            ),
            mobileRender: (productType) => (
                <div>
                    <h3 className="font-medium text-gray-900">{productType.name}</h3>
                    <p className="text-sm text-gray-500">{productType.categoryName}</p>
                    <p className="text-sm text-gray-500">{productType.status}</p>
                </div>
            )
        },
        {
            key: 'categoryName',
            header: 'Danh Mục Sản Phẩm',
            hideOnMobile: true,
            render: (productType) => (
                <div className="text-gray-700">{productType.categoryName}</div>
            )
        },
        {
            key: 'status',
            header: 'Trạng Thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (productType) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openStatusModal(productType);
                    }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${getStatusColor(productType.status)}`}
                >
                    {productType.status}
                </button>
            )
        },
        {
            key: 'actions',
            header: 'Hành Động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (productType) => (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openUpdateModal(productType);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(productType);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            mobileRender: (productType) => (
                <div className="flex space-x-2 mt-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openStatusModal(productType);
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${getStatusColor(productType.status)}`}
                    >
                        Đổi trạng thái
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openUpdateModal(productType);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(productType);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProductTypes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProductTypes.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
            {/* Header cố định */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <HeaderForManager username="Ngô Quang Thắng" role="Admin"/>
            </div>

            {/* Sidebar cố định */}
            <div className="fixed left-0 top-16 z-40">
                <SidebarForAdmin/>
            </div>

            {/* Main content - THÊM margin-left */}
            <div className="ml-0 lg:ml-64 pt-16">
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Loại Trang Phục</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý các loại trang phục theo danh mục</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm loại trang phục
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="space-y-6">
                            {/* Search Bar */}
                            <div className="w-full">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm loại trang phục..."
                                />
                            </div>

                            {/* Filters và Sort */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                        <select
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-0"
                                            value={filters.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                        >
                                            <option value="">Danh mục sản phẩm</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-0"
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                        >
                                            <option value="">Trạng thái</option>
                                            <option value="Đang bán">Đang bán</option>
                                            <option value="Đã ngưng bán">Đã ngưng bán</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Sort và Clear buttons */}
                                <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
                                    <button
                                        onClick={() => handleSort('name')}
                                        className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                            sortConfig.key === 'name'
                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <ArrowUpDown className={`h-4 w-4 ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                                        <span>
                                            Tên: {sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'Z → A' : 'A → Z'}
                                        </span>
                                    </button>

                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center space-x-2 px-4 py-2.5 border border-red-300 rounded-lg hover:bg-red-50 text-sm font-medium text-red-700 transition-colors whitespace-nowrap"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Xóa lọc</span>
                                    </button>
                                </div>
                            </div>

                            {/* Results info */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <p className="text-sm text-gray-600">
                                        Tìm thấy <span className="font-semibold text-gray-900">{filteredProductTypes.length}</span> loại trang phục
                                        {searchTerm && (
                                            <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                                        )}
                                    </p>

                                    {(filters.category || filters.status || searchTerm) && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>
                                            {filters.category && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {categories.find(cat => cat.id === filters.category)?.name}
                                                </span>
                                            )}
                                            {filters.status && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {filters.status}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        emptyMessage="Không có loại trang phục nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredProductTypes.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="loại trang phục"
                        />
                    </div>
                </div>
            </div>

            {/* Create Modals */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm loại trang phục"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại trang phục:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newProductType.name}
                            onChange={(e) => setNewProductType(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nhập tên loại trang phục"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục sản phẩm:</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newProductType.categoryId}
                            onChange={(e) => setNewProductType(prev => ({ ...prev, categoryId: e.target.value }))}
                        >
                            <option value="">Chọn danh mục sản phẩm</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Update Modals */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật loại trang phục"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại trang phục:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateProductType.name}
                            onChange={(e) => setUpdateProductType(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nhập tên loại trang phục"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục sản phẩm:</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateProductType.categoryId}
                            onChange={(e) => setUpdateProductType(prev => ({ ...prev, categoryId: e.target.value }))}
                        >
                            <option value="">Chọn danh mục sản phẩm</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowUpdateModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modals */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Bạn có chắc chắn muốn xóa loại trang phục "<span className="font-semibold">{selectedProductType?.name}</span>" không?
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Có
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Status Change Modals */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Thay đổi trạng thái"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Bạn có muốn thay đổi trạng thái của loại trang phục "<span className="font-semibold">{selectedProductType?.name}</span>"
                        từ "<span className="font-semibold">{selectedProductType?.status}</span>"
                        thành "<span className="font-semibold">{selectedProductType?.status === 'Đang bán' ? 'Đã ngưng bán' : 'Đang bán'}</span>" không?
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleStatusChange}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductType;
