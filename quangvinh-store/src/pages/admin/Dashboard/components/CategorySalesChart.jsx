import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DASHBOARD_CONSTANTS } from '../../../../utils/constants/DashboardConstants';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategorySalesChart = ({ data, loading }) => {
    const chartData = useMemo(() => {
        if (!data?.categorySalesReports) return null;

        const totalSales = data.categorySalesReports.reduce((sum, item) => sum + item.totalSales, 0);

        if (totalSales === 0) return null;

        const labels = data.categorySalesReports.map(item => item.categoryName);
        const salesData = data.categorySalesReports.map(item => item.totalSales);
        const percentages = data.categorySalesReports.map(item =>
            ((item.totalSales / totalSales) * 100).toFixed(2)
        );

        return {
            labels,
            datasets: [
                {
                    data: salesData,
                    backgroundColor: DASHBOARD_CONSTANTS.CHART_COLORS.slice(0, labels.length),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverBorderWidth: 3,
                    hoverOffset: 10
                }
            ],
            percentages
        };
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const percentage = chartData?.percentages[i] || 0;
                                return {
                                    text: `${label} (${percentage}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].borderColor,
                                    lineWidth: data.datasets[0].borderWidth,
                                    pointStyle: 'circle',
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#3B82F6',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = chartData?.percentages[context.dataIndex] || 0;
                        return `${label}: ${value} đơn hàng (${percentage}%)`;
                    }
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Doanh thu theo danh mục sản phẩm
            </h3>
            <div className="h-64">
                {chartData ? (
                    <Pie data={chartData} options={options} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Không có dữ liệu để hiển thị
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySalesChart;
