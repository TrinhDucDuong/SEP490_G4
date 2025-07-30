import React, { useState } from 'react';
import { Eye, Edit, Plus, User, Phone, MapPin, Lock } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modal from '../../../components/common/Admin/Modals';
import Pagination from '../../../components/common/Admin/Paginations';
import { EMPLOYEE_HELPERS, EMPLOYEE_DEFAULTS } from '../../../utils/constants/EmployeeConstants';

const EmployeeTable = ({
                           employees,
                           stores,
                           currentPage,
                           setCurrentPage,
                           itemsPerPage,
                           onCreateEmployee,
                           onDeleteEmployee,
                           onActivateEmployee,
                           loading
                       }) => {
    // Modal states
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Form states
    const [newEmployee, setNewEmployee] = useState(EMPLOYEE_DEFAULTS.NEW_EMPLOYEE);
    const [updateEmployee, setUpdateEmployee] = useState(null);

    // Modal handlers
    const openDetailModal = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailModal(true);
    };

    const openCreateModal = () => {
        setNewEmployee(EMPLOYEE_DEFAULTS.NEW_EMPLOYEE);
        setShowCreateModal(true);
    };

    const openUpdateModal = (employee) => {
        setSelectedEmployee(employee);
        setUpdateEmployee({
            accountId: employee.accountId,
            firstName: employee.staffName.split(' ')[0] || '',
            lastName: employee.staffName.split(' ').slice(1).join(' ') || '',
            username: employee.username || '',
            password: '',
            phoneNumber: employee.phoneNumber || '',
            workingAtStoreId: employee.workingAtStoreId || ''
        });
        setShowUpdateModal(true);
    };

    const openStatusModal = (employee) => {
        setSelectedEmployee(employee);
        setShowStatusModal(true);
    };

    // CRUD operations
    const handleCreateEmployee = async () => {
        const validation = EMPLOYEE_HELPERS.validateEmployeeData(newEmployee);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }

        const result = await onCreateEmployee(newEmployee);
        if (result.success) {
            setShowCreateModal(false);
            setNewEmployee(EMPLOYEE_DEFAULTS.NEW_EMPLOYEE);
            alert('Tạo nhân viên thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedEmployee) return;

        let result;
        if (selectedEmployee.isActive) {
            result = await onDeleteEmployee(selectedEmployee.accountId);
        } else {
            result = await onActivateEmployee(selectedEmployee.accountId);
        }

        if (result.success) {
            setShowStatusModal(false);
            setSelectedEmployee(null);
            alert('Thay đổi trạng thái thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(employees.length / itemsPerPage);

    // Table columns
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee, index) => (
                <span className="text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            )
        },
        {
            key: 'accountId',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee) => (
                <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    NV{String(employee.accountId).padStart(3, '0')}
                </span>
            )
        },
        {
            key: 'staffName',
            header: 'Tên nhân viên',
            render: (employee) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{employee.staffName}</div>
                        <div className="text-sm text-gray-500">ID: NV{String(employee.accountId).padStart(3, '0')}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'totalProcessedOrder',
            header: 'Tổng đơn xử lý',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee) => (
                <span className="text-sm font-semibold text-gray-900">
                    {employee.totalProcessedOrder || 0}
                </span>
            )
        },
        {
            key: 'totalRevenue',
            header: 'Tổng doanh thu',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee) => (
                <span className="text-sm font-semibold text-green-600">
                    {EMPLOYEE_HELPERS.formatCurrency(employee.totalRevenue || 0)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee) => (
                <button
                    onClick={() => openStatusModal(employee)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${EMPLOYEE_HELPERS.getStatusColorClass(employee.isActive)}
                        hover:opacity-80`}
                >
                    {EMPLOYEE_HELPERS.getStatusText(employee.isActive)}
                </button>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (employee) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => openDetailModal(employee)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => openUpdateModal(employee)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Cập nhật"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Danh sách nhân viên
                    </h3>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Thêm nhân viên
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    Tìm thấy {employees.length} nhân viên
                </p>
            </div>

            {/* Table */}
            <DataTable
                data={currentItems}
                columns={columns}
                loading={loading}
                emptyMessage="Không có nhân viên nào"
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Detail Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={`Thông tin chi tiết nhân viên ${selectedEmployee?.staffName}`}
                size="md"
            >
                {selectedEmployee && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ID</label>
                                <div className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                                    NV{String(selectedEmployee.accountId).padStart(3, '0')}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <User className="inline w-4 h-4 mr-1" />
                                    Tên nhân viên
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                    {selectedEmployee.staffName}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <Phone className="inline w-4 h-4 mr-1" />
                                    Số điện thoại
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                    {selectedEmployee.phoneNumber || 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Địa chỉ làm việc
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                    {selectedEmployee.workingAtStoreId || 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                    {selectedEmployee.username || 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    <Lock className="inline w-4 h-4 mr-1" />
                                    Mật khẩu
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                    ********
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đơn hàng đã xử lý</label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                    {selectedEmployee.totalProcessedOrder || 0}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tổng doanh thu</label>
                                <div className="text-sm text-green-600 font-semibold bg-gray-50 px-3 py-2 rounded">
                                    {EMPLOYEE_HELPERS.formatCurrency(selectedEmployee.totalRevenue || 0)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${EMPLOYEE_HELPERS.getStatusColorClass(selectedEmployee.isActive)}`}>
                                {EMPLOYEE_HELPERS.getStatusText(selectedEmployee.isActive)}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm nhân viên mới"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên nhân viên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newEmployee.firstName}
                                onChange={(e) => setNewEmployee(prev => ({...prev, firstName: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên nhân viên"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ nhân viên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newEmployee.lastName}
                                onChange={(e) => setNewEmployee(prev => ({...prev, lastName: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập họ nhân viên"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={newEmployee.phoneNumber}
                                onChange={(e) => setNewEmployee(prev => ({...prev, phoneNumber: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ làm việc <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newEmployee.workingAtStoreId}
                                onChange={(e) => setNewEmployee(prev => ({...prev, workingAtStoreId: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn cửa hàng</option>
                                {stores.map(store => (
                                    <option key={store.storeId} value={store.storeId}>
                                        {store.storeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên tài khoản <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newEmployee.username}
                                onChange={(e) => setNewEmployee(prev => ({...prev, username: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên tài khoản"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={newEmployee.password}
                                onChange={(e) => setNewEmployee(prev => ({...prev, password: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreateEmployee}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Update Modal */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title={`Cập nhật nhân viên ${selectedEmployee?.staffName}`}
                size="lg"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ Chức năng cập nhật đang được phát triển. Backend chưa hỗ trợ API PUT.
                        </p>
                    </div>
                    {updateEmployee && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên nhân viên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={updateEmployee.firstName}
                                        onChange={(e) => setUpdateEmployee(prev => ({...prev, firstName: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập tên nhân viên"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ nhân viên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={updateEmployee.lastName}
                                        onChange={(e) => setUpdateEmployee(prev => ({...prev, lastName: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập họ nhân viên"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={updateEmployee.phoneNumber}
                                        onChange={(e) => setUpdateEmployee(prev => ({...prev, phoneNumber: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập số điện thoại"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ làm việc <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={updateEmployee.workingAtStoreId}
                                        onChange={(e) => setUpdateEmployee(prev => ({...prev, workingAtStoreId: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled
                                    >
                                        <option value="">Chọn cửa hàng</option>
                                        {stores.map(store => (
                                            <option key={store.storeId} value={store.storeId}>
                                                {store.storeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên tài khoản <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={updateEmployee.username}
                                        onChange={(e) => setUpdateEmployee(prev => ({...prev, username: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập tên tài khoản"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={updateEmployee.password}
                                        onChange={(e) => setUpdateEmployee(prev => ({...prev, password: e.target.value}))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập mật khẩu mới"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Đóng
                                </button>
                                <button
                                    disabled
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                                >
                                    Lưu (Chưa khả dụng)
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Status Change Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Xác nhận thay đổi trạng thái"
                size="sm"
            >
                {selectedEmployee && (
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            {selectedEmployee.isActive
                                ? `Bạn có muốn ngừng hoạt động nhân viên "${selectedEmployee.staffName}" không?`
                                : `Bạn có muốn kích hoạt lại nhân viên "${selectedEmployee.staffName}" không?`
                            }
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Không
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                    selectedEmployee.isActive
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                Có
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EmployeeTable;
