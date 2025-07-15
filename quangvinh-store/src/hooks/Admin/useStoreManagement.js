import { useState, useEffect } from 'react';
import { getAllStores, createStore, updateStore, deleteStore } from '../../utils/api/Admin/StoreManagementAPI';
import { STORE_HELPERS } from '../../utils/constants/StoreConstants';

export const useStoreManagement = () => {
    const [storeList, setStoreList] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [sortConfig, setSortConfig] = useState({ key: 'storeId', direction: 'asc' });

    const fetchStores = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllStores();
            if (result.success) {
                setStoreList(result.data);
            } else {
                setError(result.error);
            }
        } catch {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const createStoreHandler = async (storeData) => {
        setLoading(true);
        try {
            const result = await createStore(storeData);
            if (result.success) {
                await fetchStores();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch {
            return { success: false, error: 'Có lỗi xảy ra khi tạo cửa hàng' };
        } finally {
            setLoading(false);
        }
    };

    const updateStoreHandler = async (storeId, storeData) => {
        setLoading(true);
        try {
            const result = await updateStore(storeId, storeData);
            if (result.success) {
                await fetchStores();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật cửa hàng' };
        } finally {
            setLoading(false);
        }
    };

    const deleteStoreHandler = async (storeId) => {
        setLoading(true);
        try {
            const result = await deleteStore(storeId);
            if (result.success) {
                await fetchStores();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch {
            return { success: false, error: 'Có lỗi xảy ra khi xóa cửa hàng' };
        } finally {
            setLoading(false);
        }
    };

    // LOGIC FILTER ĐÃ ĐƯỢC SỬA
    useEffect(() => {
        let result = [...storeList];

        // Search filter
        if (searchTerm) {
            result = result.filter(
                s =>
                    s.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.storeAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.storeId.toString().includes(searchTerm)
            );
        }

        if (filters.status !== '') {
            const isActive = filters.status === 'true'; // Chuyển string thành boolean
            result = result.filter(s => s.isActive === isActive);
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key], bValue = b[sortConfig.key];
                if (sortConfig.key === 'storeName') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }
                return sortConfig.direction === 'asc'
                    ? aValue > bValue ? 1 : -1
                    : aValue < bValue ? 1 : -1;
            });
        }

        setFilteredStores(result);
        setCurrentPage(1);
    }, [storeList, searchTerm, filters, sortConfig]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ status: '' });
        setSortConfig({ key: 'storeId', direction: 'asc' });
    };

    const getStatistics = () => {
        const totalStores = storeList.length;
        const activeStores = storeList.filter(s => s.isActive).length;
        const inactiveStores = storeList.filter(s => !s.isActive).length;
        const filteredCount = filteredStores.length;
        return { totalStores, activeStores, inactiveStores, filteredCount };
    };

    useEffect(() => { fetchStores(); }, []);

    return {
        storeList,
        filteredStores,
        loading,
        error,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,
        fetchStores,
        createStore: createStoreHandler,
        updateStore: updateStoreHandler,
        deleteStore: deleteStoreHandler,
        clearFilters,
        getStatistics
    };
};
