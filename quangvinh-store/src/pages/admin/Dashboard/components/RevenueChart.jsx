import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const RevenueChart = ({ data, loading, dateRange }) => {
    const chartData = useMemo(() => {
        if (!data?.dailyRevenues) return null;

        const labels = data.dailyRevenues.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit'
            });
        });

        const revenues = data.dailyRevenues.map(item => item.revenueByDay);

        return {
            labels,
            datasets: [
                {
                    label: 'Doanh thu (₫)',
                    data: revenues,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        };
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
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
                        return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} ₫`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 10
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    callback: function(value) {
                        return value.toLocaleString('vi-VN') + ' ₫';
                    }
                }
            }
        }
    };

    const formatDateRange = () => {
        if (!dateRange?.startDate || !dateRange?.endDate) return '';

        const start = new Date(dateRange.startDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const end = new Date(dateRange.endDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return `từ ${start} đến ${end}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Doanh thu {formatDateRange()}
            </h3>
            <div className="h-64">
                {chartData ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Không có dữ liệu để hiển thị
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueChart;
