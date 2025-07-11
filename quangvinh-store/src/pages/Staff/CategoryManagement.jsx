import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Edit, Trash2, ArrowUpDown, Eye, Clock, User, Calendar, Upload, Image as ImageIcon } from 'lucide-react';
import SidebarForAdmin from '../../components/layout/admin/SidebarForAdmin.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Modals.jsx';
import SearchBar from '../../components/common/Admin/SearchBar';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/Admin/DataTable';
import DateRangePicker from '../../components/common/Admin/DateRangePicker';
import SortButton from '../../components/common/Admin/SortButton';
import { useCategoryManagement } from '../../hooks/useCategoryManagement';

const CategoryManagement = () => {
    // API Integration - sử dụng hook
    const {
        categories: apiCategories,
        parentCategories: apiParentCategories,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategoryManagement();

    // Transform API data to match existing UI format
    const [categories, setCategories] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);

    // Giữ nguyên tất cả state UI hiện tại
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        parentCategory: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Modal states - giữ nguyên
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showEditorsModal, setShowEditorsModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        parentCategoryId: 'CREATE_NEW',
        image: null,
        imageFile: null
    });
    const [updateCategoryData, setUpdateCategoryData] = useState({
        name: '',
        parentCategoryId: '',
        image: null,
        imageFile: null
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Transform API data to match existing UI format
    useEffect(() => {
        if (apiCategories && apiCategories.length > 0) {
            const transformedCategories = apiCategories.map(apiCategory => ({
                id: apiCategory.id,
                name: apiCategory.name,
                parentCategoryId: apiCategory.parentCategoryId,
                parentCategoryName: apiCategory.parentCategoryName,
                status: apiCategory.status,
                createdBy: apiCategory.createdBy,
                createdDate: apiCategory.createdDate,
                image: apiCategory.image,
                updatedBy: apiCategory.updatedBy || []
            }));
            setCategories(transformedCategories);
        }

        if (apiParentCategories && apiParentCategories.length > 0) {
            setParentCategories(apiParentCategories);
        }
    }, [apiCategories, apiParentCategories]);

    // Giữ nguyên tất cả logic filter và search
    useEffect(() => {
        let result = [...categories];

        if (searchTerm) {
            result = result.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.parentCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.status) {
            result = result.filter(category => category.status === filters.status);
        }

        if (filters.parentCategory) {
            result = result.filter(category => category.parentCategoryId === filters.parentCategory);
        }

        if (filters.startDate && filters.endDate) {
            result = result.filter(category => {
                const categoryDate = new Date(category.createdDate);
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);
                categoryDate.setHours(0, 0, 0, 0);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                return categoryDate >= startDate && categoryDate <= endDate;
            });
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'name' || sortConfig.key === 'parentCategoryName') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return 0;
            });
        }

        setFilteredCategories(result);
        setCurrentPage(1);
    }, [categories, searchTerm, filters, sortConfig]);

    // Giữ nguyên xử lý upload ảnh
    const handleImageUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'create') {
                    setNewCategory(prev => ({
                        ...prev,
                        image: e.target.result,
                        imageFile: file
                    }));
                } else if (type === 'update') {
                    setUpdateCategoryData(prev => ({
                        ...prev,
                        image: e.target.result,
                        imageFile: file
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Giữ nguyên mở modal xem ảnh
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    // Giữ nguyên tất cả handler functions
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleDateRangeChange = (dateRange) => {
        setFilters(prev => ({
            ...prev,
            startDate: dateRange.startDate || '',
            endDate: dateRange.endDate || '',
            datePreset: dateRange.preset || ''
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            parentCategory: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    };

// Hàm lấy danh sách danh mục
    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await CategoryManagementAPI.getAllCategories();
            setCategories(data); // Giả định bạn có state categories để lưu danh sách
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
            console.error('Error fetching categories:', error);
        }
    };

// Xử lý tạo mới danh mục
    const handleCreate = async () => {
        if (!newCategory.name.trim()) { // Giả định newCategory là state lưu dữ liệu form tạo mới
            setError('Tên danh mục không được để trống');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            const categoryData = {
                categoryName: newCategory.name,
                parentCategoryId: newCategory.parentCategoryId === 'CREATE_NEW' ? null : newCategory.parentCategoryId
            };
            formData.append('categoryInputData', JSON.stringify(categoryData));
            if (newCategory.imageFile) {
                formData.append('categoryImages', newCategory.imageFile);
            }
            console.log('Dữ liệu gửi lên:', categoryData);
            console.log('File gửi lên:', newCategory.imageFile);
            await CategoryManagementAPI.createCategory(formData);
            setLoading(false);
            setShowCreateModal(false); // Giả định showCreateModal là state điều khiển modal tạo mới
            setNewCategory({ name: '', parentCategoryId: 'CREATE_NEW', image: null, imageFile: null }); // Reset form
            fetchCategories(); // Cập nhật lại danh sách
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Có lỗi xảy ra khi tạo danh mục. Vui lòng kiểm tra lại dữ liệu.');
            console.error('Error creating category:', error);
        }
    };

// Xử lý cập nhật danh mục
    const handleUpdate = async () => {
        if (!selectedCategory || !updateCategoryData.name.trim()) { // Giả định các state này tồn tại
            setError('Tên danh mục không được để trống');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            const categoryData = {
                categoryName: updateCategoryData.name,
                parentCategoryId: updateCategoryData.parentCategoryId || null
            };
            formData.append('categoryInputData', JSON.stringify(categoryData));
            if (updateCategoryData.imageFile) {
                formData.append('categoryImages', updateCategoryData.imageFile);
            }
            console.log('Dữ liệu gửi lên:', categoryData);
            console.log('File gửi lên:', updateCategoryData.imageFile);
            await CategoryManagementAPI.updateCategory(selectedCategory.categoryId, formData);
            setLoading(false);
            setShowUpdateModal(false); // Giả định showUpdateModal là state điều khiển modal cập nhật
            setSelectedCategory(null);
            setUpdateCategoryData({ name: '', parentCategoryId: '', image: null, imageFile: null }); // Reset form
            fetchCategories(); // Cập nhật lại danh sách
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Có lỗi xảy ra khi cập nhật danh mục. Vui lòng kiểm tra lại dữ liệu.');
            console.error('Error updating category:', error);
        }
    };

// Xử lý thay đổi trạng thái (xóa mềm)
    const handleStatusChange = async () => {
        if (!selectedCategory) return;
        setLoading(true);
        setError('');
        try {
            await CategoryManagementAPI.deleteCategory(selectedCategory.categoryId);
            setLoading(false);
            setShowStatusModal(false); // Giả định showStatusModal là state điều khiển modal trạng thái
            setSelectedCategory(null);
            fetchCategories(); // Cập nhật lại danh sách
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Có lỗi xảy ra khi thay đổi trạng thái danh mục.');
            console.error('Error changing status:', error);
        }
    };

    // Giữ nguyên tất cả modal handlers
    const openCreateModal = () => {
        setNewCategory({
            name: '',
            parentCategoryId: 'CREATE_NEW',
            image: null,
            imageFile: null
        });
        setShowCreateModal(true);
    };

    const openUpdateModal = (category) => {
        setSelectedCategory(category);
        setUpdateCategoryData({
            name: category.name,
            parentCategoryId: category.parentCategoryId,
            image: category.image,
            imageFile: null
        });
        setShowUpdateModal(true);
    };

    const openStatusModal = (category) => {
        setSelectedCategory(category);
        setShowStatusModal(true);
    };

    const openEditorsModal = (category) => {
        setSelectedCategory(category);
        setShowEditorsModal(true);
    };

    const getStatusColor = (status) => {
        return status === 'Đang bán'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    };

    // Giữ nguyên pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Giữ nguyên hoàn toàn columns definition
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category, index) => (
                <span className="font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            ),
            mobileRender: (category, index) => (
                <div className="font-medium text-gray-900 mb-2">
                    STT: {(currentPage - 1) * itemsPerPage + index + 1}
                </div>
            )
        },
        {
            key: 'image',
            header: 'Hình ảnh danh mục',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => openImageModal(category.image)}
                        className="relative group"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150x150/6B7280/FFFFFF?text=No+Image';
                            }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </button>
                </div>
            ),
            mobileRender: (category) => (
                <div className="mb-2 flex justify-center">
                    <button
                        onClick={() => openImageModal(category.image)}
                        className="relative group"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150x150/6B7280/FFFFFF?text=No+Image';
                            }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </button>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Danh mục sản phẩm',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            sortable: true,
            render: (category) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{category.name}</span>
                </div>
            ),
            mobileRender: (category) => (
                <div className="mb-2">
                    <div className="font-medium text-gray-900">{category.name}</div>
                </div>
            )
        },
        {
            key: 'parentCategoryName',
            header: 'Danh mục sản phẩm lớn',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            sortable: true,
            render: (category) => (
                <span className="text-gray-900">{category.parentCategoryName}</span>
            ),
            mobileRender: (category) => (
                <div className="mb-2">
                    <span className="text-sm text-gray-500">Danh mục lớn: </span>
                    <span className="text-gray-900">{category.parentCategoryName}</span>
                </div>
            )
        },
        {
            key: 'createdBy',
            header: 'Người tạo',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex flex-col items-center">
                    <span className="text-gray-900">{category.createdBy}</span>
                    <span className="text-xs text-gray-500">
                        {new Date(category.createdDate).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            ),
            mobileRender: (category) => (
                <div className="mb-2">
                    <span className="text-sm text-gray-500">Người tạo: </span>
                    <span className="text-gray-900">{category.createdBy}</span>
                    <div className="text-xs text-gray-500">
                        {new Date(category.createdDate).toLocaleDateString('vi-VN')}
                    </div>
                </div>
            )
        },
        {
            key: 'updatedBy',
            header: 'Người chỉnh sửa',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => openEditorsModal(category)}
                        className="flex items-center justify-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        <User className="w-4 h-4 mr-1" />
                        {category.updatedBy && category.updatedBy.length > 0
                            ? `${category.updatedBy.length} người`
                            : 'Chưa có'}
                    </button>
                </div>
            ),
            mobileRender: (category) => (
                <div className="mb-2">
                    <button
                        onClick={() => openEditorsModal(category)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        <User className="w-4 h-4 inline mr-1" />
                        {category.updatedBy && category.updatedBy.length > 0
                            ? `${category.updatedBy.length} người chỉnh sửa`
                            : 'Chưa có người chỉnh sửa'}
                    </button>
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (category) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => openUpdateModal(category)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => openStatusModal(category)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            category.status === 'Đang bán'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title={category.status === 'Đang bán' ? 'Ngừng bán' : 'Kích hoạt'}
                    >
                        {category.status}
                    </button>
                </div>
            ),
            mobileRender: (category) => (
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => openUpdateModal(category)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                    </button>
                    <button
                        onClick={() => openStatusModal(category)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${getStatusColor(category.status)}`}
                    >
                        {category.status}
                    </button>
                </div>
            )
        }
    ];

    // Thêm loading và error states
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <HeaderForManager username="Ngô Quang Thắng" role="Admin"/>
                </div>
                <div className="fixed left-0 top-16 z-40">
                    <SidebarForAdmin/>
                </div>
                <div className="ml-0 lg:ml-64 pt-16">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <HeaderForManager username="Ngô Quang Thắng" role="Admin"/>
                </div>
                <div className="fixed left-0 top-16 z-40">
                    <SidebarForAdmin/>
                </div>
                <div className="ml-0 lg:ml-64 pt-16">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="text-red-600 text-xl mb-4">⚠️</div>
                                <p className="text-red-600">Lỗi: {error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Giữ nguyên hoàn toàn phần return JSX
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

            {/* Main content */}
            <div>
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục sản phẩm</h1>
                            <p className="text-gray-600 mt-1">Quản lý các danh mục sản phẩm và danh mục lớn</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tạo danh mục sản phẩm</span>
                        </button>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm danh mục sản phẩm hoặc danh mục sản phẩm lớn..."
                                />
                            </div>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
                            >
                                Xóa tất cả lọc
                            </button>
                        </div>
                    </div>

                    {/* Filter & Sort Block */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Đang bán">Đang bán</option>
                                    <option value="Ngừng bán">Ngừng bán</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục lớn
                                </label>
                                <select
                                    value={filters.parentCategory}
                                    onChange={(e) => handleFilterChange('parentCategory', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả danh mục lớn</option>
                                    {parentCategories.map(pc => (
                                        <option key={pc.id} value={pc.id}>{pc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời gian tạo
                                </label>
                                <DateRangePicker
                                    value={{
                                        startDate: filters.startDate,
                                        endDate: filters.endDate,
                                        preset: filters.datePreset
                                    }}
                                    onChange={handleDateRangeChange}
                                    placeholder="Chọn khoảng thời gian"
                                />
                            </div>
                        </div>

                        {/* Sort buttons */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <SortButton
                                active={sortConfig.key === 'name'}
                                onClick={() => handleSort('name')}
                                label="Tên danh mục"
                                shortLabel={sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                            />

                            <SortButton
                                active={sortConfig.key === 'parentCategoryName'}
                                onClick={() => handleSort('parentCategoryName')}
                                label="Danh mục lớn"
                                shortLabel={sortConfig.key === 'parentCategoryName' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                            />
                        </div>

                        {/* Results count */}
                        <div className="text-sm text-gray-600">
                            Tìm thấy {filteredCategories.length} danh mục sản phẩm
                            {searchTerm && (
                                <span> cho từ khóa "<span className="font-medium">{searchTerm}</span>"</span>
                            )}
                            {(filters.status || filters.parentCategory || filters.startDate || filters.endDate) && (
                                <span> với bộ lọc đã chọn</span>
                            )}
                        </div>
                    </div>

                    {/* Data Table Block */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={currentCategories}
                            emptyMessage="Không có danh mục sản phẩm nào"
                            showLastUpdated={true}
                        />

                        {/* Pagination */}
                        <div className="border-t border-gray-200 px-6 py-4">
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
            </div>

            {/* Create Modal - Giữ nguyên UI, chỉ cập nhật logic */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tạo danh mục sản phẩm"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh danh mục
                        </label>
                        <div className="flex items-center space-x-4">
                            {newCategory.image ? (
                                <div className="relative">
                                    <img
                                        src={newCategory.image}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        onClick={() => setNewCategory(prev => ({ ...prev, image: null, imageFile: null }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'create')}
                                    className="hidden"
                                    id="create-image-upload"
                                />
                                <label
                                    htmlFor="create-image-upload"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Tải ảnh lên
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên danh mục sản phẩm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục sản phẩm lớn <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={newCategory.parentCategoryId}
                            onChange={(e) => setNewCategory({ ...newCategory, parentCategoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="CREATE_NEW">Tạo mới</option>
                            {parentCategories.map(pc => (
                                <option key={pc.id} value={pc.id}>{pc.name}</option>
                            ))}
                        </select>
                        {newCategory.parentCategoryId === 'CREATE_NEW' && (
                            <p className="text-sm text-blue-600 mt-1">
                                Danh mục này sẽ trở thành danh mục lớn mới
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!newCategory.name.trim() || loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Đang tạo...' : 'Lưu'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Update Modal - Giữ nguyên UI, chỉ cập nhật logic */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật danh mục sản phẩm"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh danh mục
                        </label>
                        <div className="flex items-center space-x-4">
                            {updateCategoryData.image ? (
                                <div className="relative">
                                    <img
                                        src={updateCategoryData.image}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-80"
                                        onClick={() => openImageModal(updateCategoryData.image)}
                                    />
                                    <button
                                        onClick={() => setUpdateCategoryData(prev => ({ ...prev, image: selectedCategory?.image, imageFile: null }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        title="Khôi phục ảnh gốc"
                                    >
                                        ↻
                                    </button>
                                </div>
                            ) : (
                                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'update')}
                                    className="hidden"
                                    id="update-image-upload"
                                />
                                <label
                                    htmlFor="update-image-upload"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Thay đổi ảnh
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={updateCategoryData.name}
                            onChange={(e) => setUpdateCategoryData({ ...updateCategoryData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên danh mục sản phẩm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục sản phẩm lớn <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={updateCategoryData.parentCategoryId}
                            onChange={(e) => setUpdateCategoryData({ ...updateCategoryData, parentCategoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {parentCategories.map(pc => (
                                <option key={pc.id} value={pc.id}>{pc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowUpdateModal(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={!updateCategoryData.name.trim() || loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Image Modal - Giữ nguyên */}
            <Modal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                title="Xem hình ảnh"
                size="lg"
            >
                <div className="flex justify-center">
                    <img
                        src={selectedImage}
                        alt="Hình ảnh danh mục"
                        className="max-w-full max-h-96 object-contain rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400/6B7280/FFFFFF?text=Không+thể+tải+ảnh';
                        }}
                    />
                </div>
            </Modal>

            {/* Status Change Modal - Giữ nguyên UI, chỉ cập nhật logic */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Xác nhận thay đổi trạng thái"
                size="sm"
            >
                <div className="text-center">
                    <p className="text-gray-700 mb-6">
                        {selectedCategory?.status === 'Đang bán'
                            ? `Bạn có muốn ngừng bán danh mục sản phẩm "${selectedCategory?.name}" không?`
                            : `Bạn có muốn kích hoạt lại danh mục sản phẩm "${selectedCategory?.name}" không?`
                        }
                    </p>
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleStatusChange}
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded-md transition-colors ${
                                selectedCategory?.status === 'Đang bán'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Đang xử lý...' : (selectedCategory?.status === 'Đang bán' ? 'Ngừng bán' : 'Kích hoạt')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Editors Modal - Giữ nguyên */}
            <Modal
                isOpen={showEditorsModal}
                onClose={() => setShowEditorsModal(false)}
                title="Danh sách người chỉnh sửa"
                size="lg"
            >
                <div className="space-y-4">
                    {selectedCategory?.updatedBy && selectedCategory.updatedBy.length > 0 ? (
                        <div className="space-y-3">
                            {selectedCategory.updatedBy.map((editor, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-500 mt-0.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium text-gray-900">{editor.user}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(editor.date).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{editor.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Chưa có người chỉnh sửa</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
