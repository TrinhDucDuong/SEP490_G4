import { useState, useEffect, useCallback } from 'react';
import { DashboardManagementAPI } from '../../utils/api/Admin/DashboardManagementAPI';
import { DASHBOARD_CONSTANTS } from '../../utils/constants/DashboardConstants';
import { useAuthForManager } from '../../context/AuthContextForManager';

export const useDashboardManagement = () => {
    const { isAuthenticated, logout } = useAuthForManager();
    const [summaryData, setSummaryData] = useState(null);
    const [revenueGraphData, setRevenueGraphData] = useState(null);
    const [categoriesSalesData, setCategoriesSalesData] = useState(null);
    const [loading, setLoading] = useState({
        summary: false,
        revenueGraph: false,
        categoriesSales: false
    });
    const [error, setError] = useState({
        summary: null,
        revenueGraph: null,
        categoriesSales: null
    });

    // Helper function để xử lý lỗi authentication
    const handleAuthError = useCallback((error) => {
        if (error.message === 'Authentication failed') {
            logout();
            return;
        }
        throw error;
    }, [logout]);

    // Fetch summary data
    const fetchSummary = useCallback(async (filterBy = DASHBOARD_CONSTANTS.FILTER_OPTIONS.MONTH) => {
        if (!isAuthenticated) return;

        setLoading(prev => ({ ...prev, summary: true }));
        setError(prev => ({ ...prev, summary: null }));

        try {
            const data = await DashboardManagementAPI.getSummary(filterBy);
            setSummaryData(data);
        } catch (err) {
            try {
                handleAuthError(err);
            } catch (authErr) {
                setError(prev => ({ ...prev, summary: authErr.message }));
            }
        } finally {
            setLoading(prev => ({ ...prev, summary: false }));
        }
    }, [isAuthenticated, handleAuthError]);

    // Fetch revenue graph data
    const fetchRevenueGraph = useCallback(async (startTime, endTime) => {
        if (!isAuthenticated) return;

        setLoading(prev => ({ ...prev, revenueGraph: true }));
        setError(prev => ({ ...prev, revenueGraph: null }));

        try {
            const data = await DashboardManagementAPI.getGraphRevenue(startTime, endTime);
            setRevenueGraphData(data);
        } catch (err) {
            try {
                handleAuthError(err);
            } catch (authErr) {
                setError(prev => ({ ...prev, revenueGraph: authErr.message }));
            }
        } finally {
            setLoading(prev => ({ ...prev, revenueGraph: false }));
        }
    }, [isAuthenticated, handleAuthError]);

    // Fetch categories sales data
    const fetchCategoriesSales = useCallback(async (startTime, endTime) => {
        if (!isAuthenticated) return;

        setLoading(prev => ({ ...prev, categoriesSales: true }));
        setError(prev => ({ ...prev, categoriesSales: null }));

        try {
            const data = await DashboardManagementAPI.getCategoriesSales(startTime, endTime);
            setCategoriesSalesData(data);
        } catch (err) {
            try {
                handleAuthError(err);
            } catch (authErr) {
                setError(prev => ({ ...prev, categoriesSales: authErr.message }));
            }
        } finally {
            setLoading(prev => ({ ...prev, categoriesSales: false }));
        }
    }, [isAuthenticated, handleAuthError]);

    // Initialize with default data only if authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        fetchSummary();

        // Default date range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        fetchRevenueGraph(startDate.toISOString(), endDate.toISOString());
        fetchCategoriesSales(startDate.toISOString(), endDate.toISOString());
    }, [isAuthenticated, fetchSummary, fetchRevenueGraph, fetchCategoriesSales]);

    return {
        summaryData,
        revenueGraphData,
        categoriesSalesData,
        loading,
        error,
        fetchSummary,
        fetchRevenueGraph,
        fetchCategoriesSales
    };
};
