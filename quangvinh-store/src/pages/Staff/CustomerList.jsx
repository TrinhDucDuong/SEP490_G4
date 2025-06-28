import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import SidebarForStaff from '../../components/layout/SidebarForStaff';
import HeaderForManager from '../../components/layout/HeaderForManager';
import Modal from '../../components/common/Modal';
import PieChart from '../../components/common/PieChart';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import SortButton from '../../components/common/SortButton';
import Pagination from '../../components/common/Pagination';
import DataTable from '../../components/common/DataTable';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        rank: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Hàm phân loại rank theo điểm thành viên
    const getRankByPoints = (points) => {
        if (points < 500) return 'Thành Viên';
        if (points >= 500 && points <= 999) return 'Bạc';
        if (points >= 1000 && points <= 1999) return 'Vàng';
        return 'Kim Cương';
    };

    // Sample data
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
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '02',
                name: 'Trần Thị B',
                birthDate: '15/05/1995',
                phone: '0111222333',
                phones: ['0111222333'],
                email: 'tranthi@gmail.com',
                points: 1200,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '03',
                name: 'Lê Văn C',
                birthDate: '20/12/1988',
                phone: '0444555666',
                phones: ['0444555666', '0777888999'],
                email: 'levan@gmail.com',
                points: 750,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '04',
                name: 'Phạm Thị D',
                birthDate: '10/08/1992',
                phone: '0333444555',
                phones: ['0333444555'],
                email: 'phamthi@gmail.com',
                points: 300,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '05',
                name: 'Hoàng Văn E',
                birthDate: '25/03/1990',
                phone: '0666777888',
                phones: ['0666777888', '0999000111'],
                email: 'hoangvan@gmail.com',
                points: 3000,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '06',
                name: 'Vũ Thị F',
                birthDate: '05/07/1985',
                phone: '0222333444',
                phones: ['0222333444'],
                email: 'vuthi@gmail.com',
                points: 650,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '07',
                name: 'Đặng Văn G',
                birthDate: '12/11/1993',
                phone: '0555666777',
                phones: ['0555666777', '0888999000'],
                email: 'dangvan@gmail.com',
                points: 1500,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '08',
                name: 'Bùi Thị H',
                birthDate: '28/02/1991',
                phone: '0111333555',
                phones: ['0111333555'],
                email: 'buith@gmail.com',
                points: 450,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '09',
                name: 'Lý Văn I',
                birthDate: '16/09/1987',
                phone: '0777999111',
                phones: ['0777999111', '0444666888'],
                email: 'lyvan@gmail.com',
                points: 2200,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '10',
                name: 'Cao Thị K',
                birthDate: '03/04/1994',
                phone: '0333555777',
                phones: ['0333555777'],
                email: 'caothi@gmail.com',
                points: 850,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '11',
                name: 'Trương Văn L',
                birthDate: '22/06/1989',
                phone: '0666888000',
                phones: ['0666888000', '0999111333'],
                email: 'truongvan@gmail.com',
                points: 1800,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '12',
                name: 'Phan Thị M',
                birthDate: '14/12/1996',
                phone: '0222444666',
                phones: ['0222444666'],
                email: 'phanthi@gmail.com',
                points: 200,
                orderHistory: 'Lịch sử đặt hàng'
            }
        ].map(customer => ({
            ...customer,
            rank: getRankByPoints(customer.points)
        }));

        setCustomers(sampleCustomers);
        setFilteredCustomers(sampleCustomers);
    }, []);

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

    // Colors cho pie chart
    const chartColors = {
        'Thành Viên': '#10B981',
        'Bạc': '#6B7280',
        'Vàng': '#F59E0B',
        'Kim Cương': '#3B82F6'
    };

    // Filter configs
    const filterConfigs = [
        {
            key: 'rank',
            label: 'Rank',
            options: [
                { value: 'Thành Viên', label: 'Thành Viên' },
                { value: 'Bạc', label: 'Bạc' },
                { value: 'Vàng', label: 'Vàng' },
                { value: 'Kim Cương', label: 'Kim Cương' }
            ]
        }
    ];

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
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
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

    // Định nghĩa columns cho DataTable
    const columns = [
        {
            key: 'id',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {customer.id}
                </span>
            ),
            mobileRender: (customer) => (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{customer.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(customer.rank)}`}>
                        {customer.rank}
                    </span>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Tên Khách Hàng',
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
            header: 'Ngày Sinh',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnTablet: true,
            cellClassName: 'text-gray-700'
        },
        {
            key: 'phone',
            header: 'Số Điện Thoại',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <span className="text-gray-900">{customer.phone}</span>
            )
        },
        {
            key: 'email',
            header: 'Email',
            hideOnMobile: true,
            render: (customer) => (
                <div className="text-gray-700 truncate max-w-48" title={customer.email}>
                    {customer.email}
                </div>
            )
        },
        {
            key: 'rank',
            header: 'Rank',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (customer) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(customer.rank)}`}>
                    <span className="lg:hidden">{customer.rank.charAt(0)}</span>
                    <span className="hidden lg:inline">{customer.rank}</span>
                </span>
            )
        },
        {
            key: 'orderHistory',
            header: 'Lịch Sử',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            hideOnDesktop: true,
            render: (customer) => (
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors">
                    Xem lịch sử
                </button>
            )
        }
    ];

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const rankStats = calculateRankStats();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative w-64 h-full">
                        <SidebarForStaff />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <SidebarForStaff />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <HeaderForManager username="Ngô Quang Thắng" role="Admin" />

                {/* Mobile Menu Button */}
                <div className="lg:hidden p-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Khách Hàng</h1>
                        <p className="text-sm text-gray-600 mt-1">Quản lý thông tin khách hàng</p>
                    </div>

                    {/* Statistics Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Thống Kê Khách Hàng Theo Rank</h2>
                        <PieChart data={rankStats} colors={chartColors} />
                    </div>

                    {/* Controls */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                        <div className="space-y-4">
                            {/* Search */}
                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm khách hàng..."
                            />

                            {/* Filters */}
                            <FilterBar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                filterConfigs={filterConfigs}
                            />

                            {/* Sort buttons */}
                            <div className="flex flex-wrap gap-2">
                                <SortButton
                                    active={sortConfig.key === 'name'}
                                    onClick={() => handleSort('name')}
                                    label="Tên A-Z"
                                    shortLabel="Tên"
                                />
                                <SortButton
                                    active={sortConfig.key === 'rank'}
                                    onClick={() => handleSort('rank')}
                                    label="Rank"
                                />
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center space-x-2 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="hidden sm:inline">Xóa lọc</span>
                                    <span className="sm:hidden">Xóa</span>
                                </button>
                            </div>

                            {/* Results info */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Tìm thấy <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> khách hàng
                                    {searchTerm && (
                                        <span className="hidden sm:inline"> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        emptyMessage="Không có khách hàng nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
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

            {/* Phone Modal */}
            <Modal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                title={`Danh sách số điện thoại - ${selectedCustomer?.name}`}
                size="md"
            >
                <div className="space-y-3">
                    {selectedCustomer?.phones.map((phone, index) => (
                        <div key={index} className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <Phone className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{phone}</p>
                                <p className="text-sm text-gray-600">Số điện thoại {index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default CustomerList;
