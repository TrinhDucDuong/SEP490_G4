import { useState, useEffect } from 'react';
import { getAllEmployees, createEmployee, deleteEmployee, activateEmployee, getEmployeeById } from '../utils/api/Admin/EmployeeManagementAPI.js';
import { getAllStores } from '../utils/api/Admin/StoreManagementAPI.js';
import { EMPLOYEE_HELPERS } from '../utils/constants/EmployeeConstants';

export const useEmployeeManagement = () => {
    // Data state
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [stores, setStores] = useState([]);
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
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Fetch employees from API
    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllEmployees();
            if (result.success) {
                // Add isActive property based on some logic or default to true
                const employeesWithStatus = result.data.map(emp => ({
                    ...emp,
                    isActive: true // Default status, adjust based on your API response
                }));
                setEmployees(employeesWithStatus);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stores for dropdown
    const fetchStores = async () => {
        try {
            const result = await getAllStores();
            if (result.success) {
                setStores(result.data);
            }
        } catch (err) {
            console.error('Error fetching stores:', err);
        }
    };

    // Create employee
    const createEmployeeHandler = async (employeeData) => {
        setLoading(true);
        try {
            const result = await createEmployee(employeeData);
            if (result.success) {
                await fetchEmployees(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo nhân viên' };
        } finally {
            setLoading(false);
        }
    };

    // Delete employee (soft delete)
    const deleteEmployeeHandler = async (employeeId) => {
        setLoading(true);
        try {
            const result = await deleteEmployee(employeeId);
            if (result.success) {
                // Update local state instead of fetching all data
                setEmployees(prev => prev.map(emp =>
                    emp.accountId === employeeId
                        ? { ...emp, isActive: false }
                        : emp
                ));
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi ngừng hoạt động nhân viên' };
        } finally {
            setLoading(false);
        }
    };

    // Activate employee
    const activateEmployeeHandler = async (employeeId) => {
        setLoading(true);
        try {
            const result = await activateEmployee(employeeId);
            if (result.success) {
                // Update local state instead of fetching all data
                setEmployees(prev => prev.map(emp =>
                    emp.accountId === employeeId
                        ? { ...emp, isActive: true }
                        : emp
                ));
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi kích hoạt nhân viên' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    useEffect(() => {
        let result = [...employees];

        // Search
        if (searchTerm) {
            result = result.filter(employee =>
                employee.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.accountId.toString().includes(searchTerm)
            );
        }

        // Filter by status
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(employee => employee.isActive === isActive);
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            result = result.filter(employee => {
                const createdDate = new Date(employee.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'staffName':
                        aValue = a.staffName.toLowerCase();
                        bValue = b.staffName.toLowerCase();
                        break;
                    case 'accountId':
                        aValue = a.accountId;
                        bValue = b.accountId;
                        break;
                    case 'totalProcessedOrder':
                        aValue = a.totalProcessedOrder || 0;
                        bValue = b.totalProcessedOrder || 0;
                        break;
                    case 'totalRevenue':
                        aValue = a.totalRevenue || 0;
                        bValue = b.totalRevenue || 0;
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
        }

        setFilteredEmployees(result);
        setCurrentPage(1);
    }, [employees, searchTerm, filters, sortConfig]);

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            status: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
    };

    // Get statistics
    const getStatistics = () => {
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(emp => emp.isActive).length;
        const inactiveEmployees = employees.filter(emp => !emp.isActive).length;
        const filteredCount = filteredEmployees.length;

        return {
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        fetchEmployees();
        fetchStores();
    }, []);

    return {
        // Data
        employees,
        filteredEmployees,
        stores,
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
        fetchEmployees,
        createEmployee: createEmployeeHandler,
        deleteEmployee: deleteEmployeeHandler,
        activateEmployee: activateEmployeeHandler,

        // Utilities
        clearFilters,
        getStatistics
    };
};
