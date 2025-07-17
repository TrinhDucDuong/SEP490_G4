import React from 'react';

const PieChart = ({ data, colors, size = 308 }) => {
    let cumulativeAngle = 0;

    const createPath = (percentage, startAngle) => {
        const angle = (percentage / 100) * 360;
        const endAngle = startAngle + angle;

        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        const largeArcFlag = angle > 180 ? 1 : 0;

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.39; // 120/308 ≈ 0.39

        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                    {data.map((item, index) => {
                        const path = createPath(parseFloat(item.percentage), cumulativeAngle);
                        cumulativeAngle += (parseFloat(item.percentage) / 100) * 360;

                        return (
                            <path
                                key={index}
                                d={path}
                                fill={colors[item.rank] || colors[item.category] || '#6B7280'}
                                stroke="#ffffff"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-lg">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{data.reduce((sum, item) => sum + item.count, 0)}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Tổng</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 lg:space-y-3 lg:grid-cols-1">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colors[item.rank] || colors[item.category] || '#6B7280' }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 min-w-20">{item.rank || item.category}</span>
                        <span className="text-sm text-gray-500">
                            {item.count} ({item.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;
