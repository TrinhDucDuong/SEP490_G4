import React, { useCallback, useState } from 'react';
import { useDashboardManagement } from '../../../hooks/Admin/useDashboardManagement';
import { useAuthForManager } from '../../../context/AuthContextForManager';
import SummarySection from './components/SummarySection';
import RevenueChart from './components/RevenueChart';
import CategorySalesChart from './components/CategorySalesChart';
import DateRangeSection from './components/DateRangeSection';
import AIVoiceAssistant from './components/AIVoiceAssistant';
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
                {/* Header with AI Assistant */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard Thống kê</h1>
                            <p className="text-gray-600 mt-2">
                                Tổng quan về hoạt động kinh doanh
                            </p>
                        </div>

                        {/* AI Voice Assistant - Positioned on the right */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <AIVoiceAssistant />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Error Messages */}
                {(error.summary || error.revenueGraph || error.categoriesSales) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-red-800 font-medium mb-2">Có lỗi xảy ra:</h3>
                        <ul className="text-red-600 text-sm space-y-1">
                            {error.summary && <li>• Lỗi tải thống kê tổng quan: {error.summary}</li>}
                            {error.revenueGraph && <li>• Lỗi tải biểu đồ doanh thu: {error.revenueGraph}</li>}
                            {error.categoriesSales && <li>• Lỗi tải thống kê danh mục: {error.categoriesSales}</li>}
                        </ul>
                    </div>
                )}

                <DateRangeSection onDateRangeChange={handleDateRangeChange}>
                    {/* Summary Section */}
                    <div className="mb-8">
                        <SummarySection
                            data={summaryData}
                            loading={loading.summary}
                            onFilterChange={handleSummaryFilterChange}
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Biểu đồ doanh thu theo thời gian
                            </h2>
                            <div className="h-80">
                                <RevenueChart
                                    data={revenueGraphData}
                                    loading={loading.revenueGraph}
                                    dateRange={currentDateRange}
                                />
                            </div>
                        </div>

                        {/* Category Sales Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Doanh số theo danh mục
                            </h2>
                            <div className="h-80">
                                <CategorySalesChart
                                    data={categoriesSalesData}
                                    loading={loading.categoriesSales}
                                />
                            </div>
                        </div>
                    </div>
                </DateRangeSection>
            </div>
        </div>
    );
};

export default DashboardManagement;
