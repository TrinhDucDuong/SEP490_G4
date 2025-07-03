import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import SidebarForStaff from '../../components/layout/admin/SidebarForStaff.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Modals.jsx';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/DataTable';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandDescription, setNewBrandDescription] = useState('');
    const [updateBrandName, setUpdateBrandName] = useState('');
    const [updateBrandDescription, setUpdateBrandDescription] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sample data
    useEffect(() => {
        const sampleBrands = [
            { id: 'BR001', name: 'Nike', description: 'Thương hiệu thể thao hàng đầu thế giới với slogan "Just Do It".', status: 'Đang bán' },
            { id: 'BR002', name: 'Adidas', description: 'Thương hiệu thể thao nổi tiếng với thiết kế sáng tạo và công nghệ tiên tiến.', status: 'Đang bán' },
            { id: 'BR003', name: 'Puma', description: 'Thương hiệu giày và trang phục thể thao đa dạng với logo con báo.', status: 'Đã ngừng bán' },
            { id: 'BR004', name: 'Under Armour', description: 'Thương hiệu chuyên về trang phục thể thao hiệu suất cao cho vận động viên.', status: 'Đang bán' },
            { id: 'BR005', name: 'Reebok', description: 'Thương hiệu giày dép và trang phục thể thao nổi tiếng từ Anh.', status: 'Đang bán' },
            { id: 'BR006', name: 'New Balance', description: 'Thương hiệu giày thể thao chất lượng cao với công nghệ đệm tiên tiến.', status: 'Đã ngừng bán' },
            { id: 'BR007', name: 'Converse', description: 'Thương hiệu giày canvas cổ điển với thiết kế All Star nổi tiếng.', status: 'Đang bán' },
            { id: 'BR008', name: 'Vans', description: 'Thương hiệu giày skateboard và streetwear phong cách California.', status: 'Đang bán' }
        ];
        setBrands(sampleBrands);
        setFilteredBrands(sampleBrands);
    }, []);

    // Search, filter, sort
    useEffect(() => {
        let result = [...brands];

        // Search
        if (searchTerm) {
            result = result.filter(brand =>
                brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter
        if (filterStatus) {
            result = result.filter(brand => brand.status === filterStatus);
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key].toLowerCase();
                const bValue = b[sortConfig.key].toLowerCase();
                if (sortConfig.direction === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            });
        }

        setFilteredBrands(result);
        setCurrentPage(1);
    }, [brands, searchTerm, filterStatus, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (value) => {
        setFilterStatus(value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setSortConfig({ key: 'name', direction: 'asc' });
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

    // CRUD Handlers
    const openDescription = (brand) => {
        setSelectedBrand(brand);
        setShowDescriptionModal(true);
    };

    const openStatusChange = (brand) => {
        setSelectedBrand(brand);
        setShowStatusModal(true);
    };

    const openUpdate = (brand) => {
        setSelectedBrand(brand);
        setUpdateBrandName(brand.name);
        setUpdateBrandDescription(brand.description);
        setShowUpdateModal(true);
    };

    const openDelete = (brand) => {
        setSelectedBrand(brand);
        setShowDeleteModal(true);
    };

    const openCreate = () => {
        setNewBrandName('');
        setNewBrandDescription('');
        setShowCreateModal(true);
    };

    const handleCreate = () => {
        if (newBrandName.trim()) {
            const newBrand = {
                id: `BR${String(brands.length + 1).padStart(3, '0')}`,
                name: newBrandName.trim(),
                description: newBrandDescription,
                status: 'Đang bán'
            };
            setBrands([...brands, newBrand]);
            setShowCreateModal(false);
        }
    };

    const handleUpdate = () => {
        if (selectedBrand && updateBrandName.trim()) {
            const updatedBrands = brands.map(brand =>
                brand.id === selectedBrand.id
                    ? { ...brand, name: updateBrandName.trim(), description: updateBrandDescription }
                    : brand
            );
            setBrands(updatedBrands);
            setShowUpdateModal(false);
            setSelectedBrand(null);
        }
    };

    const handleDelete = () => {
        if (selectedBrand) {
            const updatedBrands = brands.filter(brand => brand.id !== selectedBrand.id);
            setBrands(updatedBrands);
            setShowDeleteModal(false);
            setSelectedBrand(null);
        }
    };

    const handleStatusChange = () => {
        if (selectedBrand) {
            const newStatus = selectedBrand.status === 'Đang bán' ? 'Đã ngừng bán' : 'Đang bán';
            const updatedBrands = brands.map(brand =>
                brand.id === selectedBrand.id
                    ? { ...brand, status: newStatus }
                    : brand
            );
            setBrands(updatedBrands);
            setShowStatusModal(false);
            setSelectedBrand(null);
        }
    };

    const getStatusColor = (status) => {
        return status === 'Đang bán'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    };

    // Columns for DataTable
    const columns = [
        {
            key: 'id',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => (
                <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {brand.id}
                </span>
            ),
            mobileRender: (brand) => (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{brand.id}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openStatusChange(brand);
                        }}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusColor(brand.status)}`}
                    >
                        {brand.status}
                    </button>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Tên Thương Hiệu',
            render: (brand) => (
                <div className="font-medium text-gray-900">{brand.name}</div>
            ),
            mobileRender: (brand) => (
                <div>
                    <h3 className="font-medium text-gray-900">{brand.name}</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDescription(brand);
                        }}
                        className="inline-flex items-center px-3 py-1 mt-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
                    >
                        Mô tả ngắn
                    </button>
                </div>
            )
        },
        {
            key: 'description',
            header: 'Mô Tả Ngắn',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (brand) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openDescription(brand);
                    }}
                    className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
                >
                    Mô tả ngắn
                </button>
            )
        },
        {
            key: 'status',
            header: 'Trạng Thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (brand) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openStatusChange(brand);
                    }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${getStatusColor(brand.status)}`}
                >
                    {brand.status}
                </button>
            )
        },
        {
            key: 'actions',
            header: 'Hành Động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openUpdate(brand);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDelete(brand);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            mobileRender: (brand) => (
                <div className="flex space-x-2 mt-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openUpdate(brand);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDelete(brand);
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

            {/* Main content - THÊM margin-left để tránh sidebar */}
            <div className="ml-0 lg:ml-64 pt-16">
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý các thương hiệu sản phẩm</p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Thêm thương hiệu
                        </button>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm tên hoặc ID thương hiệu..."
                                />
                            </div>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                Xóa tất cả lọc
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái</label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        value={filterStatus}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="Đang bán">Đang bán</option>
                                        <option value="Đã ngừng bán">Đã ngừng bán</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleSort('name')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'name' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className={`h-4 w-4 ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>Sắp xếp theo tên: {sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'Z → A' : 'A → Z'}</span>
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Tìm thấy <span className="font-semibold text-gray-900">{filteredBrands.length}</span> thương hiệu
                                    {searchTerm && <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        emptyMessage="Không có thương hiệu nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredBrands.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="thương hiệu"
                        />
                    </div>
                </div>
            </div>

            {/* Description Modals */}
            <Modal
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                title={`Mô tả thương hiệu - ${selectedBrand?.name}`}
                size="md"
            >
                <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedBrand?.description || 'Không có mô tả' }} />
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
                        {selectedBrand?.status === 'Đang bán'
                            ? `Bạn muốn ngừng bán thương hiệu "${selectedBrand?.name}" không?`
                            : `Bạn muốn bán lại thương hiệu "${selectedBrand?.name}" không?`
                        }
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleStatusChange}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Có
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Create Modals */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm thương hiệu"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên thương hiệu:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            placeholder="Nhập tên thương hiệu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn:</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newBrandDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewBrandDescription(data);
                            }}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                            }}
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
                title="Cập nhật thương hiệu"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên thương hiệu:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateBrandName}
                            onChange={(e) => setUpdateBrandName(e.target.value)}
                            placeholder="Nhập tên thương hiệu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn:</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={updateBrandDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setUpdateBrandDescription(data);
                            }}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                            }}
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
                        Bạn có đồng ý xóa thương hiệu "<span className="font-semibold">{selectedBrand?.name}</span>" không? Hành động này không thể hoàn tác.
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
        </div>
    );
};

export default BrandManagement;
