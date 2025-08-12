import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ title, value, growthRate, icon: Icon, period }) => {
    const isPositive = growthRate >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            {title} {period}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
                        </p>
                    </div>
                </div>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
            {Math.abs(growthRate)}%
          </span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
