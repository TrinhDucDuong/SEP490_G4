import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Edit, Eye, Image, ArrowUpDown } from 'lucide-react';
import SidebarForStaff from '../../components/layout/admin/SidebarForStaff.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Modals.jsx';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/DataTable';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        price: '',
        status: '',
        date: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [showCustomerInfoModal, setShowCustomerInfoModal] = useState(false);
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const [showAddOrderModal, setShowAddOrderModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [showImageGalleryModal, setShowImageGalleryModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sample data với hình ảnh sản phẩm
    useEffect(() => {
        const sampleOrders = [
            {
                id: 'DH001',
                customerName: 'Nguyễn Văn A',
                customerInfo: {
                    address: '123 Đường ABC, Quận 1, TP.HCM',
                    phone: '0123456789',
                    email: 'nguyenvana@example.com',
                    note: 'Giao hàng giờ hành chính'
                },
                orderDetail: {
                    shippingUnit: 'Giao Hàng Nhanh',
                    orderTime: '2025-06-20T10:30:00',
                    discountCode: 'SALE10',
                    products: [
                        { code: 'SP001', name: 'Áo thun nam', price: 500000, quantity: 2 },
                        { code: 'SP002', name: 'Quần jean', price: 800000, quantity: 1 }
                    ],
                    store: 'Cửa hàng Quận 1',
                    staff: 'Nhân viên A',
                    productTotal: 1800000,
                    shippingFee: 30000,
                    discountAmount: 180000
                },
                productImages: [
                    'https://picsum.photos/400/300?random=1',
                    'https://picsum.photos/400/300?random=2',
                    'https://picsum.photos/400/300?random=3',
                    'https://picsum.photos/400/300?random=4'
                ],
                totalPrice: 1650000,
                status: 'Đang chờ xác nhận'
            },
            {
                id: 'DH002',
                customerName: 'Trần Thị B',
                customerInfo: {
                    address: '456 Đường XYZ, Quận 2, TP.HCM',
                    phone: '0987654321',
                    email: 'tranthib@example.com',
                    note: ''
                },
                orderDetail: {
                    shippingUnit: 'Viettel Post',
                    orderTime: '2025-06-21T14:00:00',
                    discountCode: '',
                    products: [
                        { code: 'SP003', name: 'Váy đầm', price: 1200000, quantity: 1 }
                    ],
                    store: 'Cửa hàng Quận 2',
                    staff: 'Nhân viên B',
                    productTotal: 1200000,
                    shippingFee: 25000,
                    discountAmount: 0
                },
                productImages: [
                    'https://picsum.photos/400/300?random=5',
                    'https://picsum.photos/400/300?random=6'
                ],
                totalPrice: 1225000,
                status: 'Đang vận chuyển'
            },
            {
                id: 'DH003',
                customerName: 'Lê Văn C',
                customerInfo: {
                    address: '789 Đường DEF, Quận 3, TP.HCM',
                    phone: '0111222333',
                    email: 'levanc@example.com',
                    note: 'Giao hàng ngoài giờ'
                },
                orderDetail: {
                    shippingUnit: 'Giao Hàng Tiết Kiệm',
                    orderTime: '2025-06-22T09:15:00',
                    discountCode: 'NEWYEAR',
                    products: [
                        { code: 'SP004', name: 'Áo khoác', price: 1500000, quantity: 1 },
                        { code: 'SP005', name: 'Phụ kiện', price: 200000, quantity: 3 }
                    ],
                    store: 'Cửa hàng Quận 3',
                    staff: 'Nhân viên C',
                    productTotal: 2100000,
                    shippingFee: 35000,
                    discountAmount: 315000
                },
                productImages: [
                    'https://picsum.photos/400/300?random=7',
                    'https://picsum.photos/400/300?random=8',
                    'https://picsum.photos/400/300?random=9',
                    'https://picsum.photos/400/300?random=10',
                    'https://picsum.photos/400/300?random=11',
                    'https://picsum.photos/400/300?random=12'
                ],
                totalPrice: 1820000,
                status: 'Đã giao'
            },
            {
                id: 'DH004',
                customerName: 'Phạm Thị D',
                customerInfo: {
                    address: '321 Đường GHI, Quận 4, TP.HCM',
                    phone: '0444555666',
                    email: 'phamthid@example.com',
                    note: 'Gọi trước khi giao'
                },
                orderDetail: {
                    shippingUnit: 'J&T Express',
                    orderTime: '2025-06-23T16:45:00',
                    discountCode: '',
                    products: [
                        { code: 'SP006', name: 'Giày thể thao', price: 2500000, quantity: 1 }
                    ],
                    store: 'Cửa hàng Quận 1',
                    staff: 'Nhân viên A',
                    productTotal: 2500000,
                    shippingFee: 40000,
                    discountAmount: 0
                },
                productImages: [
                    'https://picsum.photos/400/300?random=13',
                    'https://picsum.photos/400/300?random=14',
                    'https://picsum.photos/400/300?random=15'
                ],
                totalPrice: 2540000,
                status: 'Đã xác nhận(đang liên hệ đơn vị vận chuyển)'
            },
            {
                id: 'DH005',
                customerName: 'Hoàng Văn E',
                customerInfo: {
                    address: '654 Đường JKL, Quận 5, TP.HCM',
                    phone: '0777888999',
                    email: 'hoangvane@example.com',
                    note: ''
                },
                orderDetail: {
                    shippingUnit: 'Shopee Express',
                    orderTime: '2025-06-24T11:20:00',
                    discountCode: 'DISCOUNT20',
                    products: [
                        { code: 'SP007', name: 'Túi xách', price: 800000, quantity: 2 }
                    ],
                    store: 'Cửa hàng Quận 2',
                    staff: 'Nhân viên B',
                    productTotal: 1600000,
                    shippingFee: 30000,
                    discountAmount: 320000
                },
                productImages: [
                    'https://picsum.photos/400/300?random=16'
                ],
                totalPrice: 1310000,
                status: 'Đã hủy'
            }
        ];
        setOrders(sampleOrders);
        setFilteredOrders(sampleOrders);
    }, []);

    // Search and filter functionality
    useEffect(() => {
        let result = orders;

        // Apply search
        if (searchTerm) {
            result = result.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply filters
        if (filters.price) {
            result = result.filter(order => {
                const price = order.totalPrice;
                switch (filters.price) {
                    case '<1000000':
                        return price < 1000000;
                    case '1000000-5000000':
                        return price >= 1000000 && price <= 5000000;
                    case '5000000-10000000':
                        return price > 5000000 && price <= 10000000;
                    case '>10000000':
                        return price > 10000000;
                    default:
                        return true;
                }
            });
        }

        if (filters.status) {
            result = result.filter(order => order.status === filters.status);
        }

        if (filters.date) {
            result = result.filter(order => {
                const orderDate = new Date(order.orderDetail.orderTime).toISOString().split('T')[0];
                return orderDate === filters.date;
            });
        }

        // Apply sorting - CHỈ XỬ LÝ SORT THEO GIÁ
        if (sortConfig.key === 'totalPrice') {
            result.sort((a, b) => {
                const aValue = Number(a.totalPrice);
                const bValue = Number(b.totalPrice);

                // Sửa logic sort cho đúng
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            });
        }

        setFilteredOrders(result);
        setCurrentPage(1);
    }, [orders, searchTerm, filters, sortConfig]);

    const handleSort = (key) => {
        if (key === 'totalPrice') {
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
        setFilters({ price: '', status: '', date: '' });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    };

    const openCustomerInfoModal = (order) => {
        setSelectedOrder(order);
        setShowCustomerInfoModal(true);
    };

    const openOrderDetailModal = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailModal(true);
    };

    const openUpdateStatusModal = (order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.status);
        setShowUpdateStatusModal(true);
    };

    const openImageGalleryModal = (order) => {
        setSelectedOrder(order);
        setShowImageGalleryModal(true);
    };

    // Hàm cập nhật trạng thái
    const handleUpdateStatus = () => {
        if (selectedOrder && selectedStatus) {
            // Cập nhật trạng thái trong state
            const updatedOrders = orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: selectedStatus }
                    : order
            );
            setOrders(updatedOrders);

            // Cập nhật filteredOrders
            const updatedFilteredOrders = filteredOrders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: selectedStatus }
                    : order
            );
            setFilteredOrders(updatedFilteredOrders);

            setShowUpdateStatusModal(false);
            setSelectedOrder(null);
            setSelectedStatus('');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang chờ xác nhận':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Đã xác nhận(đang liên hệ đơn vị vận chuyển)':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Đang vận chuyển':
                return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'Đã giao':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'Đang trả hàng(khách hàng trả lại hàng, trường hợp đặc biệt)':
                return 'bg-gray-100 text-gray-800 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Status options
    const statusOptions = [
        'Đang chờ xác nhận',
        'Đã xác nhận(đang liên hệ đơn vị vận chuyển)',
        'Đang vận chuyển',
        'Đã giao',
        'Đã hủy',
        'Đang trả hàng(khách hàng trả lại hàng, trường hợp đặc biệt)'
    ];

    // Định nghĩa columns cho DataTable
    const columns = [
        {
            key: 'id',
            header: 'Mã Đơn Hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {order.id}
                </span>
            ),
            mobileRender: (order) => (
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{order.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            )
        },
        {
            key: 'customerName',
            header: 'Tên Khách Hàng',
            render: (order) => (
                <div className="font-medium text-gray-900">{order.customerName}</div>
            ),
            mobileRender: (order) => (
                <div>
                    <h3 className="font-medium text-gray-900">{order.customerName}</h3>
                    <p className="text-sm text-gray-500">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                </div>
            )
        },
        {
            key: 'customerInfo',
            header: 'Thông Tin Khách Hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openCustomerInfoModal(order);
                    }}
                    className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
                >
                    <Eye className="h-3 w-3 mr-1.5" />
                    Thông tin khách hàng
                </button>
            )
        },
        {
            key: 'orderDetail',
            header: 'Chi Tiết Đơn Hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openOrderDetailModal(order);
                    }}
                    className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600"
                >
                    <Eye className="h-3 w-3 mr-1.5" />
                    Chi tiết đơn hàng
                </button>
            )
        },
        {
            key: 'totalPrice',
            header: 'Tổng Tiền',
            headerAlign: 'text-right',
            cellAlign: 'text-right',
            render: (order) => (
                <div className="font-semibold text-gray-900">
                    {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                </div>
            )
        },
        {
            key: 'productImages',
            header: 'Hình Ảnh Sản Phẩm Trước Khi Được Giao',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openImageGalleryModal(order);
                    }}
                    className="inline-flex items-center px-3 py-2 bg-purple-500 text-white text-xs font-medium rounded-lg hover:bg-purple-600"
                >
                    <Image className="h-3 w-3 mr-1.5" />
                    Hình ảnh sản phẩm trước khi được giao
                </button>
            )
        },
        {
            key: 'status',
            header: 'Trạng Thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <div className="flex flex-col items-center space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openUpdateStatusModal(order);
                        }}
                        className="inline-flex items-center px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded hover:bg-orange-600"
                    >
                        <Edit className="h-3 w-3 mr-1" />
                        Cập nhật
                    </button>
                </div>
            )
        }
    ];

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Hóa Đơn</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý đơn hàng và trạng thái giao hàng</p>
                        </div>
                        <button
                            onClick={() => setShowAddOrderModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm đơn hàng
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
                                    placeholder="Tìm kiếm mã đơn hàng hoặc tên khách hàng..."
                                />
                            </div>

                            {/* Filters và Sort trong một hàng */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
                                        <select
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-0"
                                            value={filters.price}
                                            onChange={(e) => handleFilterChange('price', e.target.value)}
                                        >
                                            <option value="">Giá đơn hàng</option>
                                            <option value="<1000000">Dưới 1.000.000</option>
                                            <option value="1000000-5000000">1.000.000 - 5.000.000</option>
                                            <option value="5000000-10000000">5.000.000 - 10.000.000</option>
                                            <option value=">10000000">Trên 10.000.000</option>
                                        </select>

                                        <select
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-0"
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                        >
                                            <option value="">Trạng thái</option>
                                            <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
                                            <option value="Đã xác nhận(đang liên hệ đơn vị vận chuyển)">Đã xác nhận</option>
                                            <option value="Đang vận chuyển">Đang vận chuyển</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                            <option value="Đang trả hàng(khách hàng trả lại hàng, trường hợp đặc biệt)">Đang trả hàng</option>
                                        </select>

                                        <input
                                            type="date"
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-0"
                                            value={filters.date}
                                            onChange={(e) => handleFilterChange('date', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Sort và Clear buttons - BỎ SORT THEO TÊN */}
                                <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
                                    <button
                                        onClick={() => handleSort('totalPrice')}
                                        className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                            sortConfig.key === 'totalPrice'
                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <ArrowUpDown className={`h-4 w-4 ${sortConfig.key === 'totalPrice' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                                        <span>
                                            Giá: {sortConfig.key === 'totalPrice' && sortConfig.direction === 'desc' ? 'Cao → Thấp' : 'Thấp → Cao'}
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
                                        Tìm thấy <span className="font-semibold text-gray-900">{filteredOrders.length}</span> đơn hàng
                                        {searchTerm && (
                                            <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                                        )}
                                    </p>

                                    {(filters.price || filters.status || filters.date || searchTerm) && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>
                                            {filters.price && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Giá: {filters.price === '<1000000' ? '< 1 triệu' :
                                                    filters.price === '1000000-5000000' ? '1-5 triệu' :
                                                        filters.price === '5000000-10000000' ? '5-10 triệu' : '> 10 triệu'}
                                                </span>
                                            )}
                                            {filters.status && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {filters.status}
                                                </span>
                                            )}
                                            {filters.date && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {new Date(filters.date).toLocaleDateString('vi-VN')}
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
                        emptyMessage="Không có đơn hàng nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredOrders.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="đơn hàng"
                        />
                    </div>
                </div>
            </div>

            {/* Customer Info Modals */}
            <Modal
                isOpen={showCustomerInfoModal}
                onClose={() => setShowCustomerInfoModal(false)}
                title={`Thông tin khách hàng - ${selectedOrder?.customerName}`}
                size="md"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
                                <p className="text-gray-900">{selectedOrder.customerInfo.address || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
                                <p className="text-gray-900">{selectedOrder.customerInfo.phone || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                                <p className="text-gray-900">{selectedOrder.customerInfo.email || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
                                <p className="text-gray-900">{selectedOrder.customerInfo.note || 'Không có'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Order Detail Modals */}
            <Modal
                isOpen={showOrderDetailModal}
                onClose={() => setShowOrderDetailModal(false)}
                title={`Chi tiết đơn hàng - ${selectedOrder?.id}`}
                size="xl"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị vận chuyển:</label>
                                <p className="text-gray-900">{selectedOrder.orderDetail.shippingUnit}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian đặt hàng:</label>
                                <p className="text-gray-900">{new Date(selectedOrder.orderDetail.orderTime).toLocaleString('vi-VN')}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảm giá:</label>
                                <p className="text-gray-900">{selectedOrder.orderDetail.discountCode || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cơ sở cửa hàng:</label>
                                <p className="text-gray-900">{selectedOrder.orderDetail.store}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên chịu trách nhiệm:</label>
                                <p className="text-gray-900">{selectedOrder.orderDetail.staff}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Sản phẩm:</label>
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-300 rounded-lg">
                                    <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left border-b">Mã sản phẩm</th>
                                        <th className="px-4 py-2 text-left border-b">Tên sản phẩm</th>
                                        <th className="px-4 py-2 text-right border-b">Giá tiền</th>
                                        <th className="px-4 py-2 text-center border-b">Số lượng</th>
                                        <th className="px-4 py-2 text-right border-b">Thành tiền</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrder.orderDetail.products.map((product, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="px-4 py-2 font-mono text-sm">{product.code}</td>
                                            <td className="px-4 py-2">{product.name}</td>
                                            <td className="px-4 py-2 text-right">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                            <td className="px-4 py-2 text-center">{product.quantity}</td>
                                            <td className="px-4 py-2 text-right font-semibold">
                                                {(product.price * product.quantity).toLocaleString('vi-VN')} VNĐ
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Thông tin tổng tiền */}
                        <div className="border-t pt-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Tổng tiền sản phẩm:</span>
                                        <span className="font-medium">{selectedOrder.orderDetail.productTotal.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Vận chuyển:</span>
                                        <span className="font-medium">+{selectedOrder.orderDetail.shippingFee.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Giảm giá:</span>
                                        <span className="font-medium text-red-600">-{selectedOrder.orderDetail.discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Tổng tiền:</span>
                                        <span className="text-lg font-bold text-blue-600">{selectedOrder.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Image Gallery Modals */}
            <Modal
                isOpen={showImageGalleryModal}
                onClose={() => setShowImageGalleryModal(false)}
                title={`Hình ảnh sản phẩm - ${selectedOrder?.id}`}
                size="xl"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <p className="text-gray-600">Hình ảnh sản phẩm trước khi được giao cho khách hàng:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedOrder.productImages.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`Sản phẩm ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => window.open(image, '_blank')}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                            Click để xem lớn
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                        {index + 1}/{selectedOrder.productImages.length}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedOrder.productImages.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Chưa có hình ảnh sản phẩm nào
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Update Status Modals */}
            <Modal
                isOpen={showUpdateStatusModal}
                onClose={() => setShowUpdateStatusModal(false)}
                title={`Cập nhật trạng thái - ${selectedOrder?.id}`}
                size="md"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái hiện tại:</label>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn trạng thái mới:</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowUpdateStatusModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Order Modals */}
            <Modal
                isOpen={showAddOrderModal}
                onClose={() => setShowAddOrderModal(false)}
                title="Thêm đơn hàng mới"
                size="xl"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">Chức năng thêm đơn hàng sẽ được phát triển sau...</p>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAddOrderModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderManagement;
