import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import SidebarForStaff from '../../components/layout/admin/SidebarForStaff.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Modals.jsx';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/DataTable';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ rank: '' });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(null);
    const [editHistory, setEditHistory] = useState([]);

    // Danh sách trạng thái khách hàng - CẬP NHẬT
    const customerStatuses = [
        {
            value: 'Khóa vĩnh viễn',
            label: 'Khóa vĩnh viễn',
            color: 'bg-red-500 text-white border-red-500',
            textColor: 'text-red-500'
        },
        {
            value: 'Khách hàng cần thanh toán trước',
            label: 'Khách hàng cần thanh toán trước',
            color: 'bg-yellow-500 text-white border-yellow-500',
            textColor: 'text-yellow-600'
        },
        {
            value: 'Khách hàng phổ thông',
            label: 'Khách hàng phổ thông',
            color: 'bg-green-500 text-white border-green-500',
            textColor: 'text-green-600'
        },
        {
            value: 'Khách hàng mua nhiều',
            label: 'Khách hàng mua nhiều',
            color: 'bg-green-600 text-white border-green-600',
            textColor: 'text-green-700'
        },
        {
            value: 'Chờ xác thực',
            label: 'Chờ xác thực',
            color: 'bg-blue-500 text-white border-blue-500',
            textColor: 'text-blue-600'
        },
        {
            value: 'Tạm khóa',
            label: 'Tạm khóa',
            color: 'bg-orange-500 text-white border-orange-500',
            textColor: 'text-orange-600'
        }
    ];

    // Hàm phân loại rank theo điểm thành viên
    const getRankByPoints = (points) => {
        if (points < 500) return 'Thành Viên';
        if (points >= 500 && points <= 999) return 'Bạc';
        if (points >= 1000 && points <= 1999) return 'Vàng';
        return 'Kim Cương';
    };

    // Hàm lấy màu sắc cho trạng thái - CẬP NHẬT
    const getStatusColor = (status) => {
        const statusConfig = customerStatuses.find(s => s.value === status);
        return statusConfig ? statusConfig.color : 'bg-gray-500 text-white border-gray-500';
    };

    // Thêm hàm lấy màu text cho statistics
    const getStatusTextColor = (status) => {
        const statusConfig = customerStatuses.find(s => s.value === status);
        return statusConfig ? statusConfig.textColor : 'text-gray-600';
    };


    // Hàm lấy màu sắc cho rank
    const getRankColor = (rank) => {
        switch (rank) {
            case 'Kim Cương':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Vàng':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Bạc':
                return 'bg-gray-100 text-gray-800 border border-gray-200';
            case 'Thành Viên':
                return 'bg-green-100 text-green-800 border border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Sample data - CẬP NHẬT STATUS
    useEffect(() => {
        const sampleCustomers = [
            {
                id: '01',
                name: 'Nguyễn Văn A',
                birthDate: '01/01/2000',
                phone: '0123456789',
                phones: ['0123456789', '0987654321'],
                email: 'abc@gmail.com',
                points: 2500,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khách hàng mua nhiều'
            },
            {
                id: '02',
                name: 'Trần Thị B',
                birthDate: '15/05/1995',
                phone: '0111222333',
                phones: ['0111222333'],
                email: 'tranthi@gmail.com',
                points: 1200,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khách hàng phổ thông'
            },
            {
                id: '03',
                name: 'Lê Văn C',
                birthDate: '20/12/1988',
                phone: '0444555666',
                phones: ['0444555666', '0777888999'],
                email: 'levan@gmail.com',
                points: 750,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Tạm khóa'
            },
            {
                id: '04',
                name: 'Phạm Thị D',
                birthDate: '10/08/1992',
                phone: '0333444555',
                phones: ['0333444555'],
                email: 'phamthi@gmail.com',
                points: 300,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Chờ xác thực'
            },
            {
                id: '05',
                name: 'Hoàng Văn E',
                birthDate: '25/03/1990',
                phone: '0666777888',
                phones: ['0666777888', '0999000111'],
                email: 'hoangvan@gmail.com',
                points: 3000,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khách hàng mua nhiều'
            },
            {
                id: '06',
                name: 'Vũ Thị F',
                birthDate: '05/07/1985',
                phone: '0222333444',
                phones: ['0222333444'],
                email: 'vuthi@gmail.com',
                points: 650,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khóa vĩnh viễn'
            },
            {
                id: '07',
                name: 'Đặng Văn G',
                birthDate: '12/11/1993',
                phone: '0555666777',
                phones: ['0555666777', '0888999000'],
                email: 'dangvan@gmail.com',
                points: 1500,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khách hàng phổ thông'
            },
            {
                id: '08',
                name: 'Bùi Thị H',
                birthDate: '28/02/1991',
                phone: '0111333555',
                phones: ['0111333555'],
                email: 'buith@gmail.com',
                points: 450,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khách hàng cần thanh toán trước'
            },
            {
                id: '09',
                name: 'Lý Văn I',
                birthDate: '16/09/1987',
                phone: '0777999111',
                phones: ['0777999111', '0444666888'],
                email: 'lyvan@gmail.com',
                points: 2200,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Khách hàng mua nhiều'
            },
            {
                id: '10',
                name: 'Cao Thị K',
                birthDate: '03/04/1994',
                phone: '0333555777',
                phones: ['0333555777'],
                email: 'caothi@gmail.com',
                points: 850,
                orderHistory: 'Lịch sử đặt hàng',
                status: 'Chờ xác thực'
            }
        ].map(customer => ({
            ...customer,
            rank: getRankByPoints(customer.points)
        }));

        setCustomers(sampleCustomers);
        setFilteredCustomers(sampleCustomers);
    }, []);


    // Hàm thay đổi trạng thái khách hàng
    const handleStatusChange = (customerId, newStatus) => {
        const oldCustomer = customers.find(c => c.id === customerId);
        const updatedCustomers = customers.map(customer => {
            if (customer.id === customerId) {
                return { ...customer, status: newStatus };
            }
            return customer;
        });

        setCustomers(updatedCustomers);

        // Log lịch sử chỉnh sửa
        const editLog = {
            id: Date.now(),
            customerId: customerId,
            customerName: oldCustomer?.name,
            action: 'Thay đổi trạng thái',
            oldValue: oldCustomer?.status,
            newValue: newStatus,
            editedBy: 'Ngô Quang Thắng',
            editedAt: new Date().toLocaleString('vi-VN')
        };

        setEditHistory(prev => [editLog, ...prev]);
        setShowStatusDropdown(null);
    };

    // Tính toán thống kê rank
    const calculateRankStats = () => {
        const rankCounts = filteredCustomers.reduce((acc, customer) => {
            acc[customer.rank] = (acc[customer.rank] || 0) + 1;
            return acc;
        }, {});

        const total = filteredCustomers.length;
        return Object.entries(rankCounts).map(([rank, count]) => ({
            rank,
            count,
            percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
        }));
    };

    // Search and filter functionality
    useEffect(() => {
        let result = customers;

        // Apply search
        if (searchTerm) {
            result = result.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm) ||
                customer.rank.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filters
        if (filters.rank) {
            result = result.filter(customer => customer.rank === filters.rank);
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'name') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                } else if (sortConfig.key === 'rank') {
                    const rankOrder = { 'Thành Viên': 1, 'Bạc': 2, 'Vàng': 3, 'Kim Cương': 4 };
                    aValue = rankOrder[aValue];
                    bValue = rankOrder[bValue];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredCustomers(result);
        setCurrentPage(1);
    }, [customers, searchTerm, filters, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const clearFilters = () => {
        setFilters({ rank: '' });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    };

    const openPhoneModal = (customer) => {
        setSelectedCustomer(customer);
        setShowPhoneModal(true);
    };

    // Định nghĩa columns cho DataTable
    const columns = [
        {
            key: 'id',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <span className="font-mono text-sm font-semibold text-gray-900">
                    {customer.id}
                </span>
            ),
            mobileRender: (customer) => (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{customer.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRankColor(customer.rank)}`}>
                        {customer.rank}
                    </span>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Tên khách hàng',
            render: (customer) => (
                <div className="font-medium text-gray-900">{customer.name}</div>
            ),
            mobileRender: (customer) => (
                <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                </div>
            )
        },
        {
            key: 'birthDate',
            header: 'Ngày sinh',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (customer) => (
                <span className="text-sm text-gray-700">{customer.birthDate}</span>
            )
        },
        {
            key: 'phone',
            header: 'Số điện thoại',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (customer) => (
                <button
                    onClick={() => openPhoneModal(customer)}
                    className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Phone className="h-3 w-3 mr-1" />
                    {customer.phone}
                </button>
            )
        },
        {
            key: 'email',
            header: 'Email',
            hideOnMobile: true,
            render: (customer) => (
                <div className="text-sm text-gray-700">{customer.email}</div>
            )
        },
        {
            key: 'rank',
            header: 'Rank',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (customer) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRankColor(customer.rank)}`}>
                    {customer.rank}
                </span>
            )
        },
        {
            key: 'orderHistory',
            header: 'Lịch sử',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnMobile: true,
            render: (customer) => (
                <button className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors">
                    {customer.orderHistory}
                </button>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <div className="relative">
                    <button
                        onClick={() => setShowStatusDropdown(showStatusDropdown === customer.id ? null : customer.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${getStatusColor(customer.status)}`}
                    >
                        <span className="max-w-[120px] truncate">{customer.status}</span>
                        <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
                    </button>

                    {showStatusDropdown === customer.id && (
                        <div className="absolute top-full right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-xl mt-1 min-w-[200px] max-w-[250px]">
                            <div className="py-1">
                                {customerStatuses.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusChange(customer.id, status.value)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                            customer.status === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                        }`}
                                    >
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                    <span className="truncate">{status.label}</span>
                                </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ),
            mobileRender: (customer) => (
                <div className="mt-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowStatusDropdown(showStatusDropdown === customer.id ? null : customer.id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${getStatusColor(customer.status)}`}
                        >
                            <span>{customer.status}</span>
                            <ChevronDown className="h-3 w-3 ml-1" />
                        </button>

                        {showStatusDropdown === customer.id && (
                            <div className="absolute top-full right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-xl mt-1 min-w-[160px]">
                                <div className="py-1">
                                    {customerStatuses.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => handleStatusChange(customer.id, status.value)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                                customer.status === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
    ];

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative w-64 h-full">
                        <SidebarForStaff />
                    </div>
                </div>
            )}

            {/* Header cố định */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <HeaderForManager username="Ngô Quang Thắng" role="Admin" />
            </div>

            {/* Sidebar cố định */}
            <div className="fixed left-0 top-16 z-40 hidden lg:block">
                <SidebarForStaff />
            </div>

            {/* Main content - THÊM margin-left để tránh sidebar */}
            <div className="ml-0 lg:ml-64 pt-16">
                {/* Mobile Menu Button */}
                <div className="lg:hidden p-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý thông tin khách hàng</h1>
                        <p className="text-sm text-gray-600 mt-1">Quản lý danh sách khách hàng và thông tin</p>
                    </div>

                    {/* Statistics - HIỂN THỊ CẢ 2 LOẠI THỐNG KÊ */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Thống kê Rank */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê Rank khách hàng</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {calculateRankStats().map((stat) => (
                                    <div key={stat.rank} className="text-center">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRankColor(stat.rank)}`}>
                                            {stat.rank}
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                                            <div className="text-sm text-gray-500">{stat.percentage}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tổng quan trạng thái */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan trạng thái</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng khách hàng:</span>
                                    <span className="font-semibold">{customers.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Khách hàng mua nhiều:</span>
                                    <span className={`font-semibold ${getStatusTextColor('Khách hàng mua nhiều')}`}>
                                        {customers.filter(c => c.status === 'Khách hàng mua nhiều').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Khách hàng phổ thông:</span>
                                    <span className={`font-semibold ${getStatusTextColor('Khách hàng phổ thông')}`}>
                                        {customers.filter(c => c.status === 'Khách hàng phổ thông').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cần thanh toán trước:</span>
                                    <span className={`font-semibold ${getStatusTextColor('Khách hàng cần thanh toán trước')}`}>
                                        {customers.filter(c => c.status === 'Khách hàng cần thanh toán trước').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chờ xác thực:</span>
                                    <span className={`font-semibold ${getStatusTextColor('Chờ xác thực')}`}>
                                        {customers.filter(c => c.status === 'Chờ xác thực').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Khóa vĩnh viễn:</span>
                                    <span className={`font-semibold ${getStatusTextColor('Khóa vĩnh viễn')}`}>
                                        {customers.filter(c => c.status === 'Khóa vĩnh viễn').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Search Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm khách hàng..."
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
                                    <label className="text-sm font-medium text-gray-700">Lọc theo rank</label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        value={filters.rank}
                                        onChange={(e) => handleFilterChange('rank', e.target.value)}
                                    >
                                        <option value="">Tất cả Rank</option>
                                        <option value="Thành Viên">Thành Viên</option>
                                        <option value="Bạc">Bạc</option>
                                        <option value="Vàng">Vàng</option>
                                        <option value="Kim Cương">Kim Cương</option>
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
                                    <span>Sắp xếp theo tên: {sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'Z → A' : 'A → Z'}</span>
                                </button>
                                <button
                                    onClick={() => handleSort('rank')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'rank' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>Sắp xếp theo rank</span>
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Tìm thấy <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> khách hàng
                                    {searchTerm && (
                                        <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={currentItems}
                            emptyMessage="Không có khách hàng nào"
                        />

                        {/* Edit History Footer */}
                        {editHistory.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Lịch sử chỉnh sửa gần đây</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {editHistory.slice(0, 5).map((log) => (
                                        <div key={log.id} className="text-xs text-gray-600 bg-white p-2 rounded border">
                                            <span className="font-medium">{log.editedBy}</span> đã thay đổi trạng thái của{' '}
                                            <span className="font-medium">{log.customerName}</span> từ{' '}
                                            <span className="text-red-600">{log.oldValue}</span> thành{' '}
                                            <span className="text-green-600">{log.newValue}</span> lúc{' '}
                                            <span className="font-medium">{log.editedAt}</span>
                                        </div>
                                    ))}
                                </div>
                                {editHistory.length > 5 && (
                                    <div className="text-xs text-gray-500 mt-2">
                                        Và {editHistory.length - 5} thay đổi khác...
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredCustomers.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                itemName="khách hàng"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Phone Modals */}
            <Modal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                title={`Số điện thoại - ${selectedCustomer?.name}`}
                size="md"
            >
                {selectedCustomer && (
                    <div className="space-y-3">
                        {selectedCustomer.phones.map((phone, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="font-mono text-sm">{phone}</span>
                                </div>
                                <span className="text-xs text-gray-500">Số điện thoại {index + 1}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            {/* Click outside to close status dropdown */}
            {showStatusDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusDropdown(null)}
                />
            )}
        </div>
    );
};

export default CustomerList;
