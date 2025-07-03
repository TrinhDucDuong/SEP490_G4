import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import SidebarForStaff from '../../components/layout/admin/SidebarForStaff.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Modals.jsx';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/DataTable';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [updateCategoryName, setUpdateCategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sample data
    useEffect(() => {
        const sampleCategories = [
            {
                id: 'DM001',
                name: 'Đồ thể thao',
                status: 'Đang bán'
            },
            {
                id: 'DM002',
                name: 'Đồ mùa hè',
                status: 'Đang bán'
            },
            {
                id: 'DM003',
                name: 'Đồ dạo phố',
                status: 'Đang bán'
            },
            {
                id: 'DM004',
                name: 'Đồ công sở',
                status: 'Đã ngưng bán'
            },
            {
                id: 'DM005',
                name: 'Đồ mùa đông',
                status: 'Đang bán'
            }
        ];
        setCategories(sampleCategories);
        setFilteredCategories(sampleCategories);
    }, []);

    // Search and filter functionality
    useEffect(() => {
        let result = categories;

        // Apply search
        if (searchTerm) {
            result = result.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filters
        if (filters.status) {
            result = result.filter(category => category.status === filters.status);
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

        setFilteredCategories(result);
        setCurrentPage(1);
    }, [categories, searchTerm, filters, sortConfig]);

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
        setFilters({ status: '' });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    };

    // CRUD operations
    const handleCreate = () => {
        if (newCategoryName.trim()) {
            const newCategory = {
                id: `DM${String(categories.length + 1).padStart(3, '0')}`,
                name: newCategoryName.trim(),
                status: 'Đang bán'
            };
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            setShowCreateModal(false);
        }
    };

    const handleUpdate = () => {
        if (selectedCategory && updateCategoryName.trim()) {
            const updatedCategories = categories.map(category =>
                category.id === selectedCategory.id
                    ? { ...category, name: updateCategoryName.trim() }
                    : category
            );
            setCategories(updatedCategories);
            setShowUpdateModal(false);
            setSelectedCategory(null);
            setUpdateCategoryName('');
        }
    };

    const handleDelete = () => {
        if (selectedCategory) {
            const updatedCategories = categories.filter(category => category.id !== selectedCategory.id);
            setCategories(updatedCategories);
            setShowDeleteModal(false);
            setSelectedCategory(null);
        }
    };

    const handleStatusChange = () => {
        if (selectedCategory) {
            const newStatus = selectedCategory.status === 'Đang bán' ? 'Đã ngưng bán' : 'Đang bán';
            const updatedCategories = categories.map(category =>
                category.id === selectedCategory.id
                    ? { ...category, status: newStatus }
                    : category
            );
            setCategories(updatedCategories);
            setShowStatusModal(false);
            setSelectedCategory(null);
        }
    };

    const openCreateModal = () => {
        setNewCategoryName('');
        setShowCreateModal(true);
    };

    const openUpdateModal = (category) => {
        setSelectedCategory(category);
        setUpdateCategoryName(category.name);
        setShowUpdateModal(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const openStatusModal = (category) => {
        setSelectedCategory(category);
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
            render: (category) => (
                <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {category.id}
                </span>
            ),
            mobileRender: (category) => (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{category.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                        {category.status}
                    </span>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Tên Danh Mục Sản Phẩm',
            render: (category) => (
                <div className="font-medium text-gray-900">{category.name}</div>
            ),
            mobileRender: (category) => (
                <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.status}</p>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Trạng Thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openStatusModal(category);
                    }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${getStatusColor(category.status)}`}
                >
                    {category.status}
                </button>
            )
        },
        {
            key: 'actions',
            header: 'Hành Động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openUpdateModal(category);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(category);
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
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
            {/* Header cố định */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <HeaderForManager username="Ngô Quang Thắng" role="Admin"/>
            </div>

            {/* Sidebar cố định */}
            <div className="fixed left-0 top-16 z-40">
                <SidebarForStaff/>
            </div>

            {/* Main content - THÊM margin-left */}
            <div className="ml-0 lg:ml-64 pt-16">
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Danh Mục Sản Phẩm</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý các danh mục sản phẩm</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm danh mục sản phẩm
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
                                    placeholder="Tìm kiếm danh mục sản phẩm..."
                                />
                            </div>

                            {/* Filters và Sort */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
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
                                <p className="text-sm text-gray-600">
                                    Tìm thấy <span className="font-semibold text-gray-900">{filteredCategories.length}</span> danh mục sản phẩm
                                    {searchTerm && (
                                        <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        emptyMessage="Không có danh mục sản phẩm nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredCategories.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="danh mục"
                        />
                    </div>
                </div>
            </div>

            {/* Create Modals */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm danh mục sản phẩm"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục sản phẩm:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nhập tên danh mục sản phẩm"
                        />
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
                title="Cập nhật danh mục sản phẩm"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục sản phẩm:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateCategoryName}
                            onChange={(e) => setUpdateCategoryName(e.target.value)}
                            placeholder="Nhập tên danh mục sản phẩm"
                        />
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
                        Bạn có chắc chắn muốn xóa danh mục sản phẩm "<span className="font-semibold">{selectedCategory?.name}</span>" không?
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
                        Bạn có muốn thay đổi trạng thái danh mục sản phẩm "<span className="font-semibold">{selectedCategory?.name}</span>"
                        từ "<span className="font-semibold">{selectedCategory?.status}</span>"
                        thành "<span className="font-semibold">{selectedCategory?.status === 'Đang bán' ? 'Đã ngưng bán' : 'Đang bán'}</span>" không?
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

export default CategoryManagement;
