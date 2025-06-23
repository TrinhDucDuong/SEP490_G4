import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, X, Phone, MapPin, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import SidebarForStaff from '../../components/layout/SidebarForStaff';
import Modal from '../../components/common/Modal';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        points: '',
        maintenancePoints: '',
        rank: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
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

    // Sample data với điểm duy trì và rank tự động
    useEffect(() => {
        const sampleCustomers = [
            {
                id: '01',
                name: 'Nguyễn Văn A',
                birthDate: '01/01/2000',
                phones: ['0123456789', '0987654321'],
                email: 'abc@gmail.com',
                addresses: ['123 Đường ABC, Quận 1, TP.HCM', '456 Đường XYZ, Quận 2, TP.HCM'],
                points: 2500,
                maintenancePoints: 1500,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '02',
                name: 'Trần Thị B',
                birthDate: '15/05/1995',
                phones: ['0111222333'],
                email: 'tranthi@gmail.com',
                addresses: ['789 Đường DEF, Quận 3, TP.HCM'],
                points: 1200,
                maintenancePoints: 800,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '03',
                name: 'Lê Văn C',
                birthDate: '20/12/1988',
                phones: ['0444555666', '0777888999'],
                email: 'levan@gmail.com',
                addresses: ['321 Đường GHI, Quận 4, TP.HCM', '654 Đường JKL, Quận 5, TP.HCM'],
                points: 750,
                maintenancePoints: 400,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '04',
                name: 'Phạm Thị D',
                birthDate: '10/08/1992',
                phones: ['0333444555'],
                email: 'phamthi@gmail.com',
                addresses: ['159 Đường PQR, Quận 7, TP.HCM'],
                points: 300,
                maintenancePoints: 150,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '05',
                name: 'Hoàng Văn E',
                birthDate: '25/03/1990',
                phones: ['0666777888', '0999000111'],
                email: 'hoangvan@gmail.com',
                addresses: ['753 Đường STU, Quận 8, TP.HCM'],
                points: 3000,
                maintenancePoints: 1800,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '06',
                name: 'Vũ Thị F',
                birthDate: '05/07/1985',
                phones: ['0222333444'],
                email: 'vuthi@gmail.com',
                addresses: ['147 Đường YZ, Quận 10, TP.HCM'],
                points: 650,
                maintenancePoints: 380,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '07',
                name: 'Đặng Văn G',
                birthDate: '12/11/1993',
                phones: ['0555666777', '0888999000'],
                email: 'dangvan@gmail.com',
                addresses: ['258 Đường AB, Quận 11, TP.HCM'],
                points: 1500,
                maintenancePoints: 900,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '08',
                name: 'Bùi Thị H',
                birthDate: '28/02/1991',
                phones: ['0111333555'],
                email: 'buith@gmail.com',
                addresses: ['741 Đường EF, Bình Thạnh, TP.HCM'],
                points: 450,
                maintenancePoints: 200,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '09',
                name: 'Lý Văn I',
                birthDate: '16/09/1987',
                phones: ['0777999111', '0444666888'],
                email: 'lyvan@gmail.com',
                addresses: ['963 Đường GH, Tân Bình, TP.HCM'],
                points: 2200,
                maintenancePoints: 1600,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '10',
                name: 'Cao Thị K',
                birthDate: '03/04/1994',
                phones: ['0333555777'],
                email: 'caothi@gmail.com',
                addresses: ['159 Đường KL, Gò Vấp, TP.HCM'],
                points: 850,
                maintenancePoints: 420,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '11',
                name: 'Trương Văn L',
                birthDate: '22/06/1989',
                phones: ['0666888000', '0999111333'],
                email: 'truongvan@gmail.com',
                addresses: ['753 Đường MN, Thủ Đức, TP.HCM'],
                points: 1800,
                maintenancePoints: 750,
                orderHistory: 'Lịch sử đặt hàng'
            },
            {
                id: '12',
                name: 'Phan Thị M',
                birthDate: '14/12/1996',
                phones: ['0222444666'],
                email: 'phanthi@gmail.com',
                addresses: ['321 Đường QR, Quận 7, TP.HCM'],
                points: 200,
                maintenancePoints: 100,
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

    // Component Pie Chart responsive
    const PieChart = ({ data }) => {
        const colors = {
            'Thành Viên': '#10B981',
            'Bạc': '#6B7280',
            'Vàng': '#F59E0B',
            'Kim Cương': '#3B82F6'
        };

        const total = data.reduce((sum, item) => sum + parseFloat(item.percentage), 0);
        let cumulativeAngle = 0;

        const createPath = (percentage, startAngle) => {
            const angle = (percentage / 100) * 360;
            const endAngle = startAngle + angle;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const largeArcFlag = angle > 180 ? 1 : 0;

            const x1 = 154 + 120 * Math.cos(startAngleRad);
            const y1 = 154 + 120 * Math.sin(startAngleRad);
            const x2 = 154 + 120 * Math.cos(endAngleRad);
            const y2 = 154 + 120 * Math.sin(endAngleRad);

            return `M 154 154 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        };

        return (
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative flex-shrink-0" style={{ width: '308px', height: '308px' }}>
                    <svg width="308" height="308" viewBox="0 0 308 308" className="w-full h-full">
                        {data.map((item, index) => {
                            const path = createPath(parseFloat(item.percentage), cumulativeAngle);
                            const currentAngle = cumulativeAngle;
                            cumulativeAngle += (parseFloat(item.percentage) / 100) * 360;

                            return (
                                <path
                                    key={index}
                                    d={path}
                                    fill={colors[item.rank]}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-lg">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{filteredCustomers.length}</div>
                            <div className="text-xs sm:text-sm text-gray-500">Khách hàng</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 lg:space-y-3 lg:grid-cols-1">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors[item.rank] }}
                            ></div>
                            <span className="text-sm font-medium text-gray-700 min-w-20">{item.rank}</span>
                            <span className="text-sm text-gray-500">
                                {item.count} ({item.percentage}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Search and filter functionality
    useEffect(() => {
        let result = customers;

        // Apply search
        if (searchTerm) {
            result = result.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phones.some(phone => phone.includes(searchTerm)) ||
                customer.addresses.some(address => address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                customer.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.points.toString().includes(searchTerm) ||
                customer.maintenancePoints.toString().includes(searchTerm)
            );
        }

        // Apply filters với tiêu chí mới
        if (filters.points) {
            result = result.filter(customer => {
                const points = customer.points;
                switch (filters.points) {
                    case '<500':
                        return points < 500;
                    case '500-1000':
                        return points >= 500 && points <= 1000;
                    case '1000-2000':
                        return points >= 1000 && points <= 2000;
                    case '>=2000':
                        return points >= 2000;
                    default:
                        return true;
                }
            });
        }

        if (filters.maintenancePoints) {
            result = result.filter(customer => {
                const points = customer.maintenancePoints;
                switch (filters.maintenancePoints) {
                    case '0-350':
                        return points < 350;
                    case '350-700':
                        return points >= 350 && points < 700;
                    case '700-1400':
                        return points >= 700 && points < 1400;
                    case '>=1400':
                        return points >= 1400;
                    default:
                        return true;
                }
            });
        }

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
                } else if (sortConfig.key === 'points' || sortConfig.key === 'maintenancePoints') {
                    aValue = Number(aValue);
                    bValue = Number(bValue);
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
        setFilters({ points: '', maintenancePoints: '', rank: '' });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    };

    const openPhoneModal = (customer) => {
        setSelectedCustomer(customer);
        setShowPhoneModal(true);
    };

    const openAddressModal = (customer) => {
        setSelectedCustomer(customer);
        setShowAddressModal(true);
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

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }

        return pageNumbers;
    };

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
                <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Danh Sách Khách Hàng</h1>
                                <p className="text-sm text-gray-600 mt-1 hidden sm:block">Quản lý thông tin khách hàng</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs sm:text-sm">NT</span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900">Ngô Quang Thắng</p>
                                    <p className="text-xs text-gray-500">Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6">
                    {/* Statistics Chart - Responsive */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Thống Kê Khách Hàng Theo Rank</h2>
                        <PieChart data={rankStats} />
                    </div>

                    {/* Controls - Responsive */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm khách hàng..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filters - Responsive Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <select
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    value={filters.points}
                                    onChange={(e) => handleFilterChange('points', e.target.value)}
                                >
                                    <option value="">Điểm Thành Viên</option>
                                    <option value="<500">&lt; 500 điểm</option>
                                    <option value="500-1000">500 - 1000 điểm</option>
                                    <option value="1000-2000">1000 - 2000 điểm</option>
                                    <option value=">=2000">&ge; 2000 điểm</option>
                                </select>

                                <select
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    value={filters.maintenancePoints}
                                    onChange={(e) => handleFilterChange('maintenancePoints', e.target.value)}
                                >
                                    <option value="">Điểm Duy Trì</option>
                                    <option value="0-350">0 - 350 điểm</option>
                                    <option value="350-700">350 - 700 điểm</option>
                                    <option value="700-1400">700 - 1400 điểm</option>
                                    <option value=">=1400">&ge; 1400 điểm</option>
                                </select>

                                <select
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    value={filters.rank}
                                    onChange={(e) => handleFilterChange('rank', e.target.value)}
                                >
                                    <option value="">Rank</option>
                                    <option value="Thành Viên">Thành Viên</option>
                                    <option value="Bạc">Bạc</option>
                                    <option value="Vàng">Vàng</option>
                                    <option value="Kim Cương">Kim Cương</option>
                                </select>
                            </div>

                            {/* Sort buttons - Responsive */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleSort('name')}
                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'name'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    <span className="hidden sm:inline">Tên A-Z</span>
                                    <span className="sm:hidden">Tên</span>
                                </button>
                                <button
                                    onClick={() => handleSort('points')}
                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'points'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    <span>Điểm TV</span>
                                </button>
                                <button
                                    onClick={() => handleSort('maintenancePoints')}
                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'maintenancePoints'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    <span>Điểm DT</span>
                                </button>
                                <button
                                    onClick={() => handleSort('rank')}
                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                                        sortConfig.key === 'rank'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    <span>Rank</span>
                                </button>
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

                    {/* Table - Responsive */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Mobile Card View */}
                        <div className="block sm:hidden">
                            <div className="divide-y divide-gray-200">
                                {currentItems.map((customer) => (
                                    <div key={customer.id} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                                #{customer.id}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(customer.rank)}`}>
                                                {customer.rank}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{customer.name}</h3>
                                            <p className="text-sm text-gray-500">{customer.email}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Điểm TV:</span>
                                                <span className="ml-1 font-semibold">{customer.points.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Điểm DT:</span>
                                                <span className="ml-1 font-semibold text-orange-600">{customer.maintenancePoints.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openPhoneModal(customer)}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
                                            >
                                                <Phone className="h-3 w-3 mr-1.5" />
                                                SĐT
                                            </button>
                                            <button
                                                onClick={() => openAddressModal(customer)}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600"
                                            >
                                                <MapPin className="h-3 w-3 mr-1.5" />
                                                Địa chỉ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">ID</th>
                                    <th className="text-left px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">Tên Khách Hàng</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm hidden lg:table-cell">Ngày Sinh</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">Số Điện Thoại</th>
                                    <th className="text-left px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm hidden md:table-cell">Email</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">Địa Chỉ</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">Điểm TV</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">Điểm DT</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm">Rank</th>
                                    <th className="text-center px-2 lg:px-4 py-4 font-semibold text-gray-900 text-xs lg:text-sm hidden xl:table-cell">Lịch Sử</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentItems.map((customer, index) => (
                                    <tr key={customer.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                        <td className="px-2 lg:px-4 py-4 text-center">
                                                <span className="font-mono text-xs lg:text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                                    {customer.id}
                                                </span>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4">
                                            <div className="font-medium text-gray-900 text-xs lg:text-sm truncate max-w-32 lg:max-w-none">{customer.name}</div>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 text-center text-gray-700 text-xs lg:text-sm hidden lg:table-cell">{customer.birthDate}</td>
                                        <td className="px-2 lg:px-4 py-4 text-center">
                                            <button
                                                onClick={() => openPhoneModal(customer)}
                                                className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                                            >
                                                <Phone className="h-3 w-3 lg:mr-1.5" />
                                                <span className="hidden lg:inline">Danh sách SĐT</span>
                                            </button>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 hidden md:table-cell">
                                            <div className="text-gray-700 text-xs lg:text-sm truncate max-w-32 lg:max-w-none" title={customer.email}>
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 text-center">
                                            <button
                                                onClick={() => openAddressModal(customer)}
                                                className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                                            >
                                                <MapPin className="h-3 w-3 lg:mr-1.5" />
                                                <span className="hidden lg:inline">Danh sách địa chỉ</span>
                                            </button>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 text-center">
                                            <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-xs lg:text-sm">
                                                        {customer.points.toLocaleString()}
                                                    </span>
                                                <span className="text-xs text-gray-500 hidden lg:inline">điểm</span>
                                            </div>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 text-center">
                                            <div className="flex flex-col">
                                                    <span className="font-semibold text-orange-600 text-xs lg:text-sm">
                                                        {customer.maintenancePoints.toLocaleString()}
                                                    </span>
                                                <span className="text-xs text-gray-500 hidden lg:inline">điểm/năm</span>
                                            </div>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(customer.rank)}`}>
                                                    <span className="lg:hidden">{customer.rank.charAt(0)}</span>
                                                    <span className="hidden lg:inline">{customer.rank}</span>
                                                </span>
                                        </td>
                                        <td className="px-2 lg:px-4 py-4 text-center hidden xl:table-cell">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors">
                                                Xem lịch sử
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination - Responsive */}
                        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-700">
                                        <span className="hidden sm:inline">Hiển thị </span>
                                        <span className="font-semibold">{indexOfFirstItem + 1}</span> - <span className="font-semibold">{Math.min(indexOfLastItem, filteredCustomers.length)}</span>
                                        <span className="hidden sm:inline"> trong tổng số</span> <span className="font-semibold">{filteredCustomers.length}</span>
                                        <span className="hidden sm:inline"> khách hàng</span>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    {/* First Page */}
                                    <button
                                        onClick={() => paginate(1)}
                                        disabled={currentPage === 1}
                                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="hidden sm:inline">Đầu</span>
                                        <span className="sm:hidden">1</span>
                                    </button>

                                    {/* Previous */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                        <span className="hidden sm:inline">Trước</span>
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="hidden sm:flex items-center space-x-1">
                                        {getPageNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => paginate(pageNum)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-500 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Current Page Info - Mobile */}
                                    <div className="sm:hidden px-3 py-2 text-sm text-gray-600">
                                        {currentPage} / {totalPages}
                                    </div>

                                    {/* Next */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="hidden sm:inline">Sau</span>
                                        <ChevronRight className="h-4 w-4 sm:ml-1" />
                                    </button>

                                    {/* Last Page */}
                                    <button
                                        onClick={() => paginate(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="hidden sm:inline">Cuối</span>
                                        <span className="sm:hidden">{totalPages}</span>
                                    </button>

                                    {/* Page Info - Desktop */}
                                    <div className="hidden sm:block ml-4 text-sm text-gray-600">
                                        Trang {currentPage} / {totalPages}
                                    </div>
                                </div>
                            </div>
                        </div>
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

            {/* Address Modal */}
            <Modal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                title={`Danh sách địa chỉ - ${selectedCustomer?.name}`}
                size="lg"
            >
                <div className="space-y-3">
                    {selectedCustomer?.addresses.map((address, index) => (
                        <div key={index} className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                                <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{address}</p>
                                <p className="text-sm text-gray-600 mt-1">Địa chỉ {index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default CustomerList;
