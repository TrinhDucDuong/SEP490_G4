import React, { useCallback, useState } from 'react';
import { useDashboardManagement } from '../../../hooks/Admin/useDashboardManagement';
import { useAuthForManager } from '../../../context/AuthContextForManager';
import SummarySection from './components/SummarySection';
import RevenueChart from './components/RevenueChart';
import CategorySalesChart from './components/CategorySalesChart';
import DateRangeSection from './components/DateRangeSection';
import { LogOut } from 'lucide-react';

const DashboardManagement = () => {
    const [currentDateRange, setCurrentDateRange] = useState(null);
    const { user, logout } = useAuthForManager();

    const {
        summaryData,
        revenueGraphData,
        categoriesSalesData,
        loading,
        error,
        fetchSummary,
        fetchRevenueGraph,
        fetchCategoriesSales
    } = useDashboardManagement();

    const handleSummaryFilterChange = useCallback((filterBy) => {
        fetchSummary(filterBy);
    }, [fetchSummary]);

    const handleDateRangeChange = useCallback((startTime, endTime, dateRange) => {
        setCurrentDateRange(dateRange);
        fetchRevenueGraph(startTime, endTime);
        fetchCategoriesSales(startTime, endTime);
    }, [fetchRevenueGraph, fetchCategoriesSales]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <div>
                {/* Header với thông tin user và logout */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Thống kê</h1>
                        <p className="text-gray-600 mt-2">
                            Tổng quan về hoạt động kinh doanh
                            {user && (
                                <span className="ml-2 text-blue-600 font-medium">
                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Error Display */}
                {(error.summary || error.revenueGraph || error.categoriesSales) && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Có lỗi xảy ra khi tải dữ liệu
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    {error.summary && <p>• Lỗi tải thống kê tổng quan: {error.summary}</p>}
                                    {error.revenueGraph && <p>• Lỗi tải biểu đồ doanh thu: {error.revenueGraph}</p>}
                                    {error.categoriesSales && <p>• Lỗi tải thống kê danh mục: {error.categoriesSales}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <SummarySection
                    data={summaryData}
                    loading={loading.summary}
                    onFilterChange={handleSummaryFilterChange}
                />

                {/* Charts Section */}
                <DateRangeSection onDateRangeChange={handleDateRangeChange}>
                    {/* Revenue Chart */}
                    <RevenueChart
                        data={revenueGraphData}
                        loading={loading.revenueGraph}
                        dateRange={currentDateRange}
                    />

                    {/* Category Sales Chart */}
                    <CategorySalesChart
                        data={categoriesSalesData}
                        loading={loading.categoriesSales}
                    />
                </DateRangeSection>
            </div>
        </div>
    );
};

export default DashboardManagement;
