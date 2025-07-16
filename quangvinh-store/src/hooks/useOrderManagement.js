// src/hooks/useOrderManagement.js
import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../utils/api/Admin/OrderManagementAPI.js';
import { ORDER_HELPERS } from '../utils/constants/OrderConstants';

export const useOrderManagement = () => {
    // Data state
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    });

    // Mặc định sort theo ngày tạo mới nhất
    const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });

    // Fetch orders from API
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};

            if (filters.status) {
                params.orderStatus = filters.status;
            }

            if (sortConfig.key) {
                params.sortBy = sortConfig.key;
                params.sortDirection = sortConfig.direction;
            }

            const result = await getAllOrders(params);
            if (result.success) {
                // Tính toán totalPrice cho mỗi order
                const ordersWithTotalPrice = result.data.map(order => ({
                    ...order,
                    totalPrice: order.totalPrice || ORDER_HELPERS.calculateTotalPrice(order.orderDetails)
                }));
                setOrders(ordersWithTotalPrice);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const updateOrderStatusHandler = async (orderId, newStatus) => {
        setLoading(true);
        try {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                await fetchOrders(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng' };
        } finally {
            setLoading(false);
        }
    };

    // Delete order
    const deleteOrderHandler = async (orderId) => {
        setLoading(true);
        try {
            const result = await deleteOrder(orderId);
            if (result.success) {
                await fetchOrders(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi xóa đơn hàng' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    useEffect(() => {
        let result = [...orders];

        // Search
        if (searchTerm) {
            result = result.filter(order =>
                order.orderId.toString().includes(searchTerm) ||
                ORDER_HELPERS.getCustomerName(order.owner).toLowerCase().includes(searchTerm.toLowerCase()) ||
                ORDER_HELPERS.getCustomerEmail(order.owner).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            result = result.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        // Local sorting (nếu API không hỗ trợ sort)
        if (sortConfig.key && sortConfig.key !== 'orderDate') {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'orderId':
                        aValue = a.orderId;
                        bValue = b.orderId;
                        break;
                    case 'totalPrice':
                        aValue = a.totalPrice || 0;
                        bValue = b.totalPrice || 0;
                        break;
                    case 'orderStatus':
                        aValue = ORDER_HELPERS.getStatusText(a.orderStatus).toLowerCase();
                        bValue = ORDER_HELPERS.getStatusText(b.orderStatus).toLowerCase();
                        break;
                    case 'customerName':
                        aValue = ORDER_HELPERS.getCustomerName(a.owner).toLowerCase();
                        bValue = ORDER_HELPERS.getCustomerName(b.owner).toLowerCase();
                        break;
                    default:
                        aValue = a[sortConfig.key];
                        bValue = b[sortConfig.key];
                }

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        setFilteredOrders(result);
        setCurrentPage(1);
    }, [orders, searchTerm, filters, sortConfig]);

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            status: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSortConfig({ key: 'orderDate', direction: 'desc' });
    };

    // Handle date preset changes
    const handleDatePresetChange = (preset) => {
        const now = new Date();
        let startDate = '';
        let endDate = '';

        switch (preset) {
            case 'today':
                startDate = now.toISOString().split('T')[0];
                endDate = startDate;
                break;
            case 'yesterday':
            { const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.toISOString().split('T')[0];
                endDate = startDate;
                break; }
            case 'last7days':
            { const last7Days = new Date(now);
                last7Days.setDate(last7Days.getDate() - 7);
                startDate = last7Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break; }
            case 'last30days':
            { const last30Days = new Date(now);
                last30Days.setDate(last30Days.getDate() - 30);
                startDate = last30Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break; }
            case 'last3months':
            { const last3Months = new Date(now);
                last3Months.setMonth(last3Months.getMonth() - 3);
                startDate = last3Months.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break; }
            default:
                startDate = '';
                endDate = '';
        }

        setFilters(prev => ({
            ...prev,
            startDate,
            endDate,
            datePreset: preset
        }));
    };

    // Get statistics
    const getStatistics = () => {
        const totalOrders = orders.length;
        const processingOrders = orders.filter(order => order.orderStatus === 'PROCESSING').length;
        const shippingOrders = orders.filter(order => order.orderStatus === 'SHIPPING').length;
        const deliveredOrders = orders.filter(order => order.orderStatus === 'DELIVERED').length;
        const canceledOrders = orders.filter(order => order.orderStatus === 'CANCELED').length;
        const filteredCount = filteredOrders.length;

        return {
            totalOrders,
            processingOrders,
            shippingOrders,
            deliveredOrders,
            canceledOrders,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchOrders();
    }, [filters.status, sortConfig]);

    return {
        // Data
        orders,
        filteredOrders,
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,

        // Search, Filter, Sort
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,

        // Actions
        fetchOrders,
        updateOrderStatus: updateOrderStatusHandler,
        deleteOrder: deleteOrderHandler,

        // Utilities
        clearFilters,
        handleDatePresetChange,
        getStatistics
    };
};
