import { useState, useEffect } from 'react';
import { getAllCustomers } from '../../utils/api/Admin/CustomerListAPI.js';
import { CUSTOMER_HELPERS } from '../../utils/constants/CustomerConstants.js';

export const useCustomerList = () => {
    // Data state
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'accountId', direction: 'asc' });

    // Fetch customers from API
    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllCustomers();
            if (result.success) {
                setCustomers(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // filter and search logic
    useEffect(() => {
        let result = [...customers];

        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(customer => {
                // Safe null handling với optional chaining
                const fullName = customer.fullName || '';
                const email = customer.email || '';
                const phoneNumber = customer.phoneNumber || '';

                return (
                    fullName.toLowerCase().includes(searchLower) ||
                    email.toLowerCase().includes(searchLower) ||
                    phoneNumber.includes(searchTerm)
                );
            });
        }

        setFilteredCustomers(result);
    }, [searchTerm, customers]);
    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setSortConfig({ key: 'accountId', direction: 'asc' });
    };

    // Get statistics
    const getStatistics = () => {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(customer => customer.isActive).length;
        const inactiveCustomers = customers.filter(customer => !customer.isActive).length;
        const filteredCount = filteredCustomers.length;

        return {
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    return {
        // Data
        customers,
        filteredCustomers,
        loading,
        error,
        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        // Search, filter, Sort
        searchTerm,
        setSearchTerm,
        sortConfig,
        setSortConfig,
        // Actions
        fetchCustomers,
        // Utilities
        clearFilters,
        getStatistics
    };
};
