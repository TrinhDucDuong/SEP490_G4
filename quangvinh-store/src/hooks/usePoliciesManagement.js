import { useState, useEffect } from 'react';
import { getAllPolicies, createPolicy, updatePolicy, deletePolicy } from '../utils/api/Admin/PoliciesManagementAPI.js';
import { POLICY_HELPERS } from '../utils/constants/PoliciesConstants';

export const usePoliciesManagement = () => {
    // Data state
    const [policies, setPolicies] = useState([]);
    const [filteredPolicies, setFilteredPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        datePreset: ''
    });

    // Mặc định sort theo ngày tạo mới nhất
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Fetch policies from API
    const fetchPolicies = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllPolicies();
            if (result.success) {
                setPolicies(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Create policy
    const createPolicyHandler = async (policyData) => {
        setLoading(true);
        try {
            const result = await createPolicy(policyData);
            if (result.success) {
                await fetchPolicies(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo chính sách' };
        } finally {
            setLoading(false);
        }
    };

    // Update policy
    const updatePolicyHandler = async (policyId, policyData) => {
        setLoading(true);
        try {
            const result = await updatePolicy(policyId, policyData);
            if (result.success) {
                await fetchPolicies(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật chính sách' };
        } finally {
            setLoading(false);
        }
    };

    // Delete policy
    const deletePolicyHandler = async (policyId) => {
        setLoading(true);
        try {
            const result = await deletePolicy(policyId);
            if (result.success) {
                await fetchPolicies(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi xóa chính sách' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    useEffect(() => {
        let result = [...policies];

        // Search
        if (searchTerm) {
            result = result.filter(policy =>
                policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.policyId.toString().includes(searchTerm) ||
                policy.policyDescription.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            result = result.filter(policy => {
                const createdDate = new Date(policy.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'policyName':
                        aValue = a.policyName.toLowerCase();
                        bValue = b.policyName.toLowerCase();
                        break;
                    case 'policyId':
                        aValue = a.policyId;
                        bValue = b.policyId;
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt);
                        bValue = new Date(b.createdAt);
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
        } else {
            // Mặc định sort theo ngày tạo mới nhất
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredPolicies(result);
        setCurrentPage(1);
    }, [policies, searchTerm, filters, sortConfig]);

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
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
        const totalPolicies = policies.length;
        const filteredCount = filteredPolicies.length;

        return {
            totalPolicies,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchPolicies();
    }, []);

    return {
        // Data
        policies,
        filteredPolicies,
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
        fetchPolicies,
        createPolicy: createPolicyHandler,
        updatePolicy: updatePolicyHandler,
        deletePolicy: deletePolicyHandler,

        // Utilities
        clearFilters,
        handleDatePresetChange,
        getStatistics
    };
};
