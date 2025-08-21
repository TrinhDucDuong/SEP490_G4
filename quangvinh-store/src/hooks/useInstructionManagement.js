import { useState, useEffect } from 'react';
import { getAllInstructions, createInstruction, updateInstruction, deleteInstruction } from '../utils/api/Admin/InstructionManagementAPI.js';
import { INSTRUCTION_HELPERS } from '../utils/constants/InstructionConstants';

export const useInstructionManagement = () => {
    // Data state
    const [instructions, setInstructions] = useState([]);
    const [filteredInstructions, setFilteredInstructions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        datePreset: ''
    });

    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Fetch instructions from API
    const fetchInstructions = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllInstructions();
            if (result.success) {
                setInstructions(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Create instruction
    const createInstructionHandler = async (instructionData) => {
        setLoading(true);
        try {
            const result = await createInstruction(instructionData);
            if (result.success) {
                await fetchInstructions(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo hướng dẫn' };
        } finally {
            setLoading(false);
        }
    };

    // Update instruction
    const updateInstructionHandler = async (instructionId, instructionData) => {
        setLoading(true);
        try {
            const result = await updateInstruction(instructionId, instructionData);
            if (result.success) {
                await fetchInstructions(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật hướng dẫn' };
        } finally {
            setLoading(false);
        }
    };

    // Delete instruction
    const deleteInstructionHandler = async (instructionId) => {
        setLoading(true);
        try {
            const result = await deleteInstruction(instructionId);
            if (result.success) {
                await fetchInstructions(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi xóa hướng dẫn' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    useEffect(() => {
        let result = [...instructions];

        // Search
        if (searchTerm) {
            result = result.filter(instruction =>
                instruction.instructionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                instruction.instructionId.toString().includes(searchTerm) ||
                instruction.instructionDescription.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            result = result.filter(instruction => {
                const createdDate = new Date(instruction.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'instructionName':
                        aValue = a.instructionName.toLowerCase();
                        bValue = b.instructionName.toLowerCase();
                        break;
                    case 'instructionId':
                        aValue = a.instructionId;
                        bValue = b.instructionId;
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

        setFilteredInstructions(result);
        setCurrentPage(1);
    }, [instructions, searchTerm, filters, sortConfig]);

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
            {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.toISOString().split('T')[0];
                endDate = startDate;
                break;
            }
            case 'last7days':
            {
                const last7Days = new Date(now);
                last7Days.setDate(last7Days.getDate() - 7);
                startDate = last7Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T');
                break;
            }
            case 'last30days':
            {
                const last30Days = new Date(now);
                last30Days.setDate(last30Days.getDate() - 30);
                startDate = last30Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T');
                break;
            }
            case 'last3months':
            {
                const last3Months = new Date(now);
                last3Months.setMonth(last3Months.getMonth() - 3);
                startDate = last3Months.toISOString().split('T')[0];
                endDate = now.toISOString().split('T');
                break;
            }
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
        const totalInstructions = instructions.length;
        const filteredCount = filteredInstructions.length;

        return {
            totalInstructions,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchInstructions();
    }, []);

    return {
        // Data
        instructions,
        filteredInstructions,
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,

        // Search, filter, Sort
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,

        // Actions
        fetchInstructions,
        createInstruction: createInstructionHandler,
        updateInstruction: updateInstructionHandler,
        deleteInstruction: deleteInstructionHandler,

        // Utilities
        clearFilters,
        handleDatePresetChange,
        getStatistics
    };
};
