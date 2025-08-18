import React from 'react';
import { STAR_RATE_CONSTANTS } from '../../../utils/constants/StarRateConstants';

const StarRateSort = ({ sortBy, onSortChange }) => {
    // Helper to toggle sort order for a given field
    const toggleSortOrder = (fieldAsc, fieldDesc) => {
        if (sortBy === fieldDesc) {
            onSortChange(fieldAsc);
        } else {
            onSortChange(fieldDesc);
        }
    };

    // Determine label and active state based on current sort order
    const getSortButtonInfo = (fieldAsc, fieldDesc, labelBase) => {
        if (sortBy === fieldDesc) {
            return {
                label: `${labelBase} (Lớn → Bé)`,
                isActive: true,
                nextOrder: 'asc'
            };
        } else if (sortBy === fieldAsc) {
            return {
                label: `${labelBase} (Bé → Lớn)`,
                isActive: true,
                nextOrder: 'desc'
            };
        } else {
            return {
                label: `${labelBase}`,
                isActive: false,
                nextOrder: 'desc'
            };
        }
    };

    const idSortInfo = getSortButtonInfo(
        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_ASC,
        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_DESC,
        'Sắp xếp theo ID'
    );

    const starSortInfo = getSortButtonInfo(
        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ASC,
        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_DESC,
        'Sắp xếp theo số sao'
    );

    const dateSortInfo = getSortButtonInfo(
        STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_ASC,
        STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_DESC,
        'Sắp xếp theo ngày đánh giá'
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort by ID */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                    Sắp xếp theo ID
                </label>
                <button
                    type="button"
                    onClick={() => toggleSortOrder(
                        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_ASC,
                        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_DESC
                    )}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        idSortInfo.isActive
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <span>{idSortInfo.label}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${
                                idSortInfo.isActive
                                    ? (sortBy === STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_ASC ? 'rotate-180' : '')
                                    : 'opacity-50'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Sort by Star Rate */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                    Sắp xếp theo số sao
                </label>
                <button
                    type="button"
                    onClick={() => toggleSortOrder(
                        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ASC,
                        STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_DESC
                    )}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        starSortInfo.isActive
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <span>{starSortInfo.label}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${
                                starSortInfo.isActive
                                    ? (sortBy === STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ASC ? 'rotate-180' : '')
                                    : 'opacity-50'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Sort by Created At */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                    Sắp xếp theo ngày
                </label>
                <button
                    type="button"
                    onClick={() => toggleSortOrder(
                        STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_ASC,
                        STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_DESC
                    )}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        dateSortInfo.isActive
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <span>{dateSortInfo.label}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${
                                dateSortInfo.isActive
                                    ? (sortBy === STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_ASC ? 'rotate-180' : '')
                                    : 'opacity-50'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default StarRateSort;
