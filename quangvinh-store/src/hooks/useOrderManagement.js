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
    const [authError, setAuthError] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '', // Giữ lại để tương thích với filter, nhưng không dùng trong update
        startDate: '',
        endDate: '',
        datePreset: ''
    });

    // Mặc định sort theo ngày tạo mới nhất
    const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });

    // Fetch orders from API - SỬA ĐỂ SỬ DỤNG customerName TRỰC TIẾP
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        setAuthError(false);

        try {
            const params = {};
            if (filters.status) {
                params.orderStatus = filters.status;
            }

            if (filters.paymentStatus !== '') {
                params.paymentStatus = filters.paymentStatus;
            }

            if (sortConfig.key) {
                params.sortBy = sortConfig.key;
                params.sortDirection = sortConfig.direction;
            }

            const result = await getAllOrders(params);
            if (result.success) {
                // SỬA: Sử dụng customerName trực tiếp từ API response
                const ordersWithTotalPrice = result.data.map(order => ({
                    ...order,
                    totalPrice: order.totalPrice || ORDER_HELPERS.calculateTotalPrice(order.orderDetails),
                    paymentStatus: order.paymentStatus !== undefined ? order.paymentStatus : false
                }));

                setOrders(ordersWithTotalPrice);
            } else {
                if (result.error.includes('đăng nhập')) {
                    setAuthError(true);
                }
                setError(result.error);
            }
        } catch (err) {
            if (err.message.includes('đăng nhập')) {
                setAuthError(true);
            }
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Update order status - CHỈ CẬP NHẬT orderStatus (không có paymentStatus)
    const updateOrderStatusHandler = async (orderId, updateData) => {
        setLoading(true);
        try {
            // Chỉ gửi orderStatus, không gửi paymentStatus
            const requestData = {
                orderStatus: updateData.orderStatus
            };

            const result = await updateOrderStatus(orderId, requestData);
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

    // Filter and search logic - CẬP NHẬT
    useEffect(() => {
        let result = [...orders];

        // Search - SỬA ĐỂ SỬ DỤNG customerName
        if (searchTerm) {
            result = result.filter(order =>
                order.orderId.toString().includes(searchTerm) ||
                (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.customerPhoneNumber && order.customerPhoneNumber.includes(searchTerm))
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
                    case 'paymentStatus':
                        aValue = a.paymentStatus ? 1 : 0;
                        bValue = b.paymentStatus ? 1 : 0;
                        break;
                    case 'customerName':
                        // SỬA: Sử dụng customerName trực tiếp
                        aValue = (a.customerName || '').toLowerCase();
                        bValue = (b.customerName || '').toLowerCase();
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
            paymentStatus: '',
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
        const paidOrders = orders.filter(order => order.paymentStatus === true).length;
        const unpaidOrders = orders.filter(order => order.paymentStatus === false).length;
        const filteredCount = filteredOrders.length;

        return {
            totalOrders,
            processingOrders,
            shippingOrders,
            deliveredOrders,
            canceledOrders,
            paidOrders,
            unpaidOrders,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchOrders();
    }, [filters.status, filters.paymentStatus, sortConfig]);

    return {
        // Data
        orders,
        filteredOrders,
        loading,
        error,
        authError,

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
