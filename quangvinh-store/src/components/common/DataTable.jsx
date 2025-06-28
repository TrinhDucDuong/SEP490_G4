import React from 'react';

const DataTable = ({
                       columns,
                       data,
                       onRowClick,
                       className = "",
                       emptyMessage = "Không có dữ liệu"
                   }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="p-4 space-y-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column) => {
                                if (column.mobileRender) {
                                    return column.mobileRender(item, index);
                                }
                                return null;
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className={`w-full ${className}`}>
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-4 py-4 font-semibold text-gray-900 ${column.headerAlign || 'text-left'} ${column.headerClassName || ''} ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.hideOnTablet ? 'hidden lg:table-cell' : ''} ${column.hideOnDesktop ? 'hidden xl:table-cell' : ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-4 py-4 ${column.cellAlign || 'text-left'} ${column.cellClassName || ''} ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.hideOnTablet ? 'hidden lg:table-cell' : ''} ${column.hideOnDesktop ? 'hidden xl:table-cell' : ''}`}
                                >
                                    {column.render ? column.render(item, index) : item[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
