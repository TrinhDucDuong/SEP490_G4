import React, { useState } from 'react';
import { Eye, Phone } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modal from '../../../components/common/Admin/Modals';
import Pagination from '../../../components/common/Admin/Paginations';
import { CUSTOMER_HELPERS } from '../../../utils/constants/CustomerConstants';

const CustomerTable = ({
                           customers,
                           currentPage,
                           setCurrentPage,
                           itemsPerPage,
                           loading
                       }) => {
    // Modal states
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Modal handlers
    const openPhoneModal = (customer) => {
        setSelectedCustomer(customer);
        setShowPhoneModal(true);
    };

    // Table columns configuration
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer, index) => (
                <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            )
        },
        {
            key: 'accountId',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                    {customer.accountId}
                </span>
            ),
            mobileRender: (customer) => (
                <div>
                    <p className="font-semibold text-gray-900">{customer.fullName}</p>
                    <p className="text-sm text-gray-500">ID: {customer.accountId}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-600">{customer.phoneNumber}</p>
                </div>
            )
        },
        {
            key: 'fullName',
            header: 'Tên khách hàng',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (customer) => (
                <div>
                    <p className="font-medium text-gray-900">{customer.fullName}</p>
                </div>
            )
        },
        {
            key: 'phoneNumber',
            header: 'Số điện thoại',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => openPhoneModal(customer)}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">
                            {CUSTOMER_HELPERS.formatPhone(customer.phoneNumber)}
                        </span>
                    </button>
                </div>
            )
        },
        {
            key: 'email',
            header: 'Email',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (customer) => (
                <span className="text-gray-700">{customer.email}</span>
            )
        },
        {
            key: 'birthDate',
            header: 'Ngày sinh',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <span className="text-gray-700">
                    {CUSTOMER_HELPERS.formatDate(customer.birthDate)}
                </span>
            )
        }
    ];

    // Calculate pagination
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const paginatedCustomers = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Danh sách khách hàng
                    </h3>
                    <span className="text-sm text-gray-500">
                        Tìm thấy {customers.length} khách hàng
                    </span>
                </div>

                <DataTable
                    data={paginatedCustomers}
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có khách hàng nào"
                />

                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Phone Modal */}
            <Modal
                show={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                title="Thông tin liên hệ"
                size="md"
            >
                {selectedCustomer && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                                {selectedCustomer.fullName}
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">
                                        {selectedCustomer.phoneNumber}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-4 h-4 text-gray-500">@</span>
                                    <span className="text-gray-700">
                                        {selectedCustomer.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerTable;
