// src/hooks/Admin/useSNSManagement.js
import { useState, useEffect } from 'react';
import { getAllSNS, createSNS, updateSNS, deleteSNS } from '../../utils/api/Admin/SNSManagementAPI.js';
import { SNS_HELPERS } from '../../utils/constants/SNSConstants';

export const useSNSManagement = () => {
    // Data state
    const [snsList, setSNSList] = useState([]);
    const [filteredSNS, setFilteredSNS] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: 'snsId', direction: 'asc' });

    // Fetch SNS from API
    const fetchSNS = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllSNS();
            if (result.success) {
                setSNSList(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Create SNS
    const createSNSHandler = async (snsData) => {
        setLoading(true);
        try {
            const result = await createSNS(snsData);
            if (result.success) {
                await fetchSNS(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo mạng xã hội' };
        } finally {
            setLoading(false);
        }
    };

    // Update SNS
    const updateSNSHandler = async (snsId, snsData) => {
        setLoading(true);
        try {
            const result = await updateSNS(snsId, snsData);
            if (result.success) {
                await fetchSNS(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật mạng xã hội' };
        } finally {
            setLoading(false);
        }
    };

    // Delete SNS
    const deleteSNSHandler = async (snsId) => {
        setLoading(true);
        try {
            const result = await deleteSNS(snsId);
            if (result.success) {
                await fetchSNS(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi xóa mạng xã hội' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    useEffect(() => {
        let result = [...snsList];

        // Search
        if (searchTerm) {
            result = result.filter(sns =>
                sns.snsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sns.snsId.toString().includes(searchTerm)
            );
        }

        // Filter by status
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(sns => sns.isActive === isActive);
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'snsName':
                        aValue = a.snsName.toLowerCase();
                        bValue = b.snsName.toLowerCase();
                        break;
                    case 'snsId':
                        aValue = a.snsId;
                        bValue = b.snsId;
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

        setFilteredSNS(result);
        setCurrentPage(1);
    }, [snsList, searchTerm, filters, sortConfig]);

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            status: ''
        });
        setSortConfig({ key: 'snsId', direction: 'asc' });
    };

    // Get statistics
    const getStatistics = () => {
        const totalSNS = snsList.length;
        const activeSNS = snsList.filter(sns => sns.isActive).length;
        const inactiveSNS = snsList.filter(sns => !sns.isActive).length;
        const filteredCount = filteredSNS.length;

        return {
            totalSNS,
            activeSNS,
            inactiveSNS,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchSNS();
    }, []);

    return {
        // Data
        snsList,
        filteredSNS,
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
        fetchSNS,
        createSNS: createSNSHandler,
        updateSNS: updateSNSHandler,
        deleteSNS: deleteSNSHandler,

        // Utilities
        clearFilters,
        getStatistics
    };
};
