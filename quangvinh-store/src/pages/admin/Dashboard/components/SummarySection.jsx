import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Users } from 'lucide-react';
import SummaryCard from './SummaryCard';
import FilterDropdown from './FilterDropdown';
import { DASHBOARD_CONSTANTS } from '../../../../utils/constants/DashboardConstants';

const SummarySection = ({ data, loading, onFilterChange }) => {
    const [filter, setFilter] = useState(DASHBOARD_CONSTANTS.FILTER_OPTIONS.MONTH);

    useEffect(() => {
        onFilterChange(filter);
    }, [filter, onFilterChange]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const getPeriodLabel = (filterType) => {
        return DASHBOARD_CONSTANTS.FILTER_LABELS[filterType] || '';
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Thống kê tổng quan</h2>
                <FilterDropdown value={filter} onChange={handleFilterChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Tổng đơn hàng"
                    value={data.orderSummary?.totalOrder || 0}
                    growthRate={data.orderSummary?.orderGrowthRate || 0}
                    icon={ShoppingCart}
                    period={getPeriodLabel(filter)}
                />

                <SummaryCard
                    title="Tổng doanh thu"
                    value={`${(data.revenueSummary?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`}
                    growthRate={data.revenueSummary?.revenueGrowthRate || 0}
                    icon={DollarSign}
                    period={getPeriodLabel(filter)}
                />

                <SummaryCard
                    title="Tổng lượng khách hàng"
                    value={data.customerSummary?.totalCustomer || 0}
                    growthRate={data.customerSummary?.customerGrowthRate || 0}
                    icon={Users}
                    period={getPeriodLabel(filter)}
                />
            </div>
        </div>
    );
};

export default SummarySection;
