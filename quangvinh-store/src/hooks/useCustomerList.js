import { useState, useEffect } from 'react';
import { getAllCustomers } from '../utils/api/Admin/CustomerListAPI.js';
import { CUSTOMER_HELPERS } from '../utils/constants/CustomerConstants';

export const useCustomerList = () => {
    // Data state
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
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

    // Filter and search logic
    useEffect(() => {
        let result = [...customers];

        // Search
        if (searchTerm) {
            result = result.filter(customer =>
                customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phoneNumber.includes(searchTerm) ||
                customer.accountId.toString().includes(searchTerm)
            );
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'fullName':
                        aValue = a.fullName.toLowerCase();
                        bValue = b.fullName.toLowerCase();
                        break;
                    case 'accountId':
                        aValue = a.accountId;
                        bValue = b.accountId;
                        break;
                    case 'email':
                        aValue = a.email.toLowerCase();
                        bValue = b.email.toLowerCase();
                        break;
                    case 'phoneNumber':
                        aValue = a.phoneNumber;
                        bValue = b.phoneNumber;
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

        setFilteredCustomers(result);
        setCurrentPage(1);
    }, [customers, searchTerm, sortConfig]);

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
        // Search, Filter, Sort
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
