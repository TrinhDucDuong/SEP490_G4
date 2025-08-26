import React, { useCallback, useState } from 'react';
import { useDashboardManagement } from '../../../hooks/admin/useDashboardManagement';
import { useAuthForManager } from '../../../context/AuthContextForManager';
import SummarySection from './components/SummarySection';
import RevenueChart from './components/RevenueChart';
import CategorySalesChart from './components/CategorySalesChart';
import DateRangeSection from './components/DateRangeSection';
import AIVoiceAssistant from './components/AIVoiceAssistant';
import { LogOut } from 'lucide-react';
import {FaCommentDots, FaRobot} from "react-icons/fa";

const DashboardManagement = () => {
    const [currentDateRange, setCurrentDateRange] = useState(null);
    const [showAIChat, setShowAIChat] = useState(false);
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
                    </div>
                </div>

                    {/* Summary Section */}
                    <div className="mb-8">
                        <SummarySection
                            data={summaryData}
                            loading={loading.summary}
                            onFilterChange={handleSummaryFilterChange}
                        />
                    </div>

                <DateRangeSection onDateRangeChange={handleDateRangeChange}>
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

            {/* FAB BUTTONS */}
            <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
                <button
                    onClick={() => setShowAIChat(true)}
                    className="bg-gray-700 hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
                    title="Trợ lý AI"
                >
                    <FaRobot size={20} />
                </button>
            </div>

            {/* AI Chat Modal */}
            {showAIChat && (
                <AIVoiceAssistant
                    isOpen={showAIChat}
                    onClose={() => setShowAIChat(false)}
                />
            )}

        </div>
    );
};

export default DashboardManagement;
