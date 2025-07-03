import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, ArrowUpDown, Phone, User, Lock } from 'lucide-react';
import SidebarForStaff from '../../components/layout/admin/SidebarForStaff.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/DataTable.jsx';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Modals states
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        name: '', username: '', password: '', phone: '', status: 'Đang hoạt động'
    });
    const [updateEmployee, setUpdateEmployee] = useState({
        id: '', name: '', username: '', password: '', phone: '', status: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sample data
    useEffect(() => {
        const sampleEmployees = [
            {
                id: 'NV001',
                name: 'Nguyễn Văn An',
                username: 'nguyenvanan',
                password: 'password123',
                phone: '0123456789',
                ordersHandled: 25,
                totalRevenue: 45000000,
                status: 'Đang hoạt động'
            },
            {
                id: 'NV002',
                name: 'Trần Thị Bình',
                username: 'tranthibinh',
                password: 'password456',
                phone: '0987654321',
                ordersHandled: 18,
                totalRevenue: 32000000,
                status: 'Đang hoạt động'
            },
            {
                id: 'NV003',
                name: 'Lê Hoàng Cường',
                username: 'lehoangcuong',
                password: 'password789',
                phone: '0111222333',
                ordersHandled: 12,
                totalRevenue: 28000000,
                status: 'Ngừng hoạt động'
            },
            {
                id: 'NV004',
                name: 'Phạm Thị Dung',
                username: 'phamthidung',
                password: 'password101',
                phone: '0444555666',
                ordersHandled: 30,
                totalRevenue: 55000000,
                status: 'Đang hoạt động'
            },
            {
                id: 'NV005',
                name: 'Hoàng Văn Em',
                username: 'hoangvanem',
                password: 'password202',
                phone: '0777888999',
                ordersHandled: 8,
                totalRevenue: 15000000,
                status: 'Ngừng hoạt động'
            }
        ];
        setEmployees(sampleEmployees);
        setFilteredEmployees(sampleEmployees);
    }, []);

    // Search, filter, sort
    useEffect(() => {
        let result = [...employees];

        if (searchTerm) {
            result = result.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus) {
            result = result.filter(employee => employee.status === filterStatus);
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'name') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                } else if (sortConfig.key === 'ordersHandled' || sortConfig.key === 'totalRevenue') {
                    return sortConfig.direction === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }
                return 0;
            });
        }

        setFilteredEmployees(result);
        setCurrentPage(1);
    }, [employees, searchTerm, filterStatus, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setSortConfig({ key: null, direction: 'asc' });
    };

    // CRUD operations
    const handleAddEmployee = () => {
        if (!newEmployee.name.trim() || !newEmployee.username.trim()) return;

        const employee = {
            id: `NV${String(employees.length + 1).padStart(3, '0')}`,
            ...newEmployee,
            ordersHandled: 0,
            totalRevenue: 0
        };

        setEmployees([...employees, employee]);
        setNewEmployee({ name: '', username: '', password: '', phone: '', status: 'Đang hoạt động' });
        setShowAddModal(false);
    };

    const handleUpdateEmployee = () => {
        if (!updateEmployee.name.trim() || !updateEmployee.username.trim()) return;

        const updatedEmployees = employees.map(emp =>
            emp.id === updateEmployee.id ? updateEmployee : emp
        );

        setEmployees(updatedEmployees);
        setShowUpdateModal(false);
        setSelectedEmployee(null);
    };

    const handleDeleteEmployee = () => {
        const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
        setEmployees(updatedEmployees);
        setShowDeleteModal(false);
        setSelectedEmployee(null);
    };

    const handleStatusChange = () => {
        const newStatus = selectedEmployee.status === 'Đang hoạt động' ? 'Ngừng hoạt động' : 'Đang hoạt động';
        const updatedEmployees = employees.map(emp =>
            emp.id === selectedEmployee.id ? { ...emp, status: newStatus } : emp
        );

        setEmployees(updatedEmployees);
        setShowStatusModal(false);
        setSelectedEmployee(null);
    };

    // Modals handlers
    const openDetailModal = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailModal(true);
    };

    const openAddModal = () => {
        setNewEmployee({ name: '', username: '', password: '', phone: '', status: 'Đang hoạt động' });
        setShowAddModal(true);
    };

    const openUpdateModal = (employee) => {
        setSelectedEmployee(employee);
        setUpdateEmployee(employee);
        setShowUpdateModal(true);
    };

    const openDeleteModal = (employee) => {
        setSelectedEmployee(employee);
        setShowDeleteModal(true);
    };

    const openStatusModal = (employee) => {
        setSelectedEmployee(employee);
        setShowStatusModal(true);
    };

    const getStatusColor = (status) => {
        return status === 'Đang hoạt động'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN').replace(/,/g, '.') + ' VNĐ';
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    // Columns for DataTable
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee, index) => (
                <span className="font-mono text-sm font-semibold text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
            ),
        },
        {
            key: 'name',
            header: 'Tên nhân viên',
            render: (employee) => <div className="font-medium text-gray-900">{employee.name}</div>,
            mobileRender: (employee) => (
                <div>
                    <h3 className="font-medium text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">ID: {employee.id}</p>
                    <p className="text-sm font-semibold text-blue-600">
                        {employee.ordersHandled} đơn hàng
                    </p>
                </div>
            )
        },
        {
            key: 'detail',
            header: 'Chi tiết nhân viên',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (employee) => (
                <button
                    onClick={() => openDetailModal(employee)}
                    className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
                >
                    <Eye className="h-3 w-3 mr-1"/>
                    Chi tiết nhân viên
                </button>
            )
        },
        {
            key: 'ordersHandled',
            header: 'Số đơn đã xử lý',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (employee) => (
                <span className="font-semibold text-gray-900">{employee.ordersHandled}</span>
            )
        },
        {
            key: 'totalRevenue',
            header: 'Tổng doanh thu',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (employee) => (
                <span className="font-semibold text-green-600">
          {formatCurrency(employee.totalRevenue)}
        </span>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (employee) => (
                <button
                    onClick={() => openStatusModal(employee)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusColor(employee.status)}`}
                >
                    {employee.status}
                </button>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => openUpdateModal(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => openDeleteModal(employee)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            mobileRender: (employee) => (
                <div className="flex space-x-2 mt-3">
                    <button
                        onClick={() => openDetailModal(employee)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chi tiết"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => openUpdateModal(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => openDeleteModal(employee)}
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

            {/* Main content */}
            <div className="ml-0 lg:ml-64 pt-16">
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý thông tin và hoạt động của nhân viên</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Thêm nhân viên
                        </button>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm theo tên nhân viên..."
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
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="Đang hoạt động">Đang hoạt động</option>
                                        <option value="Ngừng hoạt động">Ngừng hoạt động</option>
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

                                <button
                                    onClick={() => handleSort('ordersHandled')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'ordersHandled' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className={`h-4 w-4 ${sortConfig.key === 'ordersHandled' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>Số đơn: {sortConfig.key === 'ordersHandled' && sortConfig.direction === 'desc' ? 'Nhiều → Ít' : 'Ít → Nhiều'}</span>
                                </button>

                                <button
                                    onClick={() => handleSort('totalRevenue')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'totalRevenue' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className={`h-4 w-4 ${sortConfig.key === 'totalRevenue' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>Doanh thu: {sortConfig.key === 'totalRevenue' && sortConfig.direction === 'desc' ? 'Nhiều → Ít' : 'Ít → Nhiều'}</span>
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Tìm thấy <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> nhân viên
                                    {searchTerm && <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        emptyMessage="Không có nhân viên nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredEmployees.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="nhân viên"
                        />
                    </div>
                </div>
            </div>

            {/* Modals Chi tiết nhân viên */}
            <Modals
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Chi tiết nhân viên"
                size="md"
            >
                {selectedEmployee && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                                    <p className="text-sm text-gray-600">ID: {selectedEmployee.id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                                        <p className="text-gray-900">{selectedEmployee.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Tài khoản</p>
                                        <p className="text-gray-900">{selectedEmployee.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Mật khẩu</p>
                                        <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                            {selectedEmployee.password} {/* THAY ĐỔI: Hiển thị mật khẩu thật thay vì dấu * */}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-green-700">Đơn hàng đã xử lý</p>
                                    <p className="text-2xl font-bold text-green-900">{selectedEmployee.ordersHandled}</p>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-blue-700">Tổng doanh thu</p>
                                    <p className="text-lg font-bold text-blue-900">{formatCurrency(selectedEmployee.totalRevenue)}</p>
                                </div>

                                <div className={`p-4 rounded-lg ${selectedEmployee.status === 'Đang hoạt động' ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <p className={`text-sm font-medium ${selectedEmployee.status === 'Đang hoạt động' ? 'text-green-700' : 'text-red-700'}`}>Trạng thái</p>
                                    <p className={`text-lg font-bold ${selectedEmployee.status === 'Đang hoạt động' ? 'text-green-900' : 'text-red-900'}`}>{selectedEmployee.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Modals Thêm nhân viên */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Thêm nhân viên mới"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhân viên</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            placeholder="Nhập tên nhân viên"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài khoản</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newEmployee.username}
                            onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                            placeholder="Nhập tên tài khoản"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="text" // THAY ĐỔI: từ "password" thành "text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newEmployee.password}
                            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAddEmployee}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modals Cập nhật nhân viên */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật thông tin nhân viên"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhân viên</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateEmployee.name}
                            onChange={(e) => setUpdateEmployee({ ...updateEmployee, name: e.target.value })}
                            placeholder="Nhập tên nhân viên"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài khoản</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateEmployee.username}
                            onChange={(e) => setUpdateEmployee({ ...updateEmployee, username: e.target.value })}
                            placeholder="Nhập tên tài khoản"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="text" // THAY ĐỔI: từ "password" thành "text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateEmployee.password}
                            onChange={(e) => setUpdateEmployee({ ...updateEmployee, password: e.target.value })}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={updateEmployee.phone}
                            onChange={(e) => setUpdateEmployee({ ...updateEmployee, phone: e.target.value })}
                            placeholder="Nhập số điện thoại"
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
                            onClick={handleUpdateEmployee}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modals Xóa nhân viên */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xóa nhân viên"
                size="md"
            >
                <div className="space-y-4">
                    <p>
                        Bạn có đồng ý xóa nhân viên "{selectedEmployee?.name}" không? Hành động này không thể hoàn tác.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleDeleteEmployee}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Có
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modals Thay đổi trạng thái */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Thay đổi trạng thái nhân viên"
                size="md"
            >
                <div className="space-y-4">
                    <p>
                        {selectedEmployee?.status === 'Đang hoạt động'
                            ? `Bạn muốn ngừng hoạt động nhân viên "${selectedEmployee?.name}" không?`
                            : `Bạn muốn kích hoạt lại nhân viên "${selectedEmployee?.name}" không?`
                        }
                    </p>
                    <div className="flex justify-end space-x-3">
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
        </div>
    );
};

export default EmployeeManagement;
