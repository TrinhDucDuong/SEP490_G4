import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const Filter = ({ categories, setFilterOptions, filterOptions }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [isSizeOpen, setIsSizeOpen] = useState(false);

    const brands = ['all', 'Apple', 'Samsung', 'Sony', 'LG'];
    const priceRanges = [
        { label: 'Dưới 500.000 VND', value: [0, 500000] },
        { label: '500.000 - 1.000.000 VND', value: [500000, 1000000] },
        { label: '1.000.000 - 2.000.000 VND', value: [1000000, 2000000] },
        { label: 'Trên 2.000.000 VND', value: [2000000, 1000000] },
    ];
    const colors = [
        { name: 'all', code: '' },
        { name: 'Đen', code: '#000000' },
        { name: 'Hồng', code: '#bb8d8d' },
        { name: 'Đỏ', code: '#FF0000' },
        { name: 'Xanh', code: '#00FF00' },
    ];
    const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL'];

    const handleFilterChange = (key, value) => {
        setFilterOptions(prev => ({ ...prev, [key]: value }));
    };

    const handlePriceChange = value => {
        setFilterOptions(prev => ({ ...prev, priceRange: value }));
    };

    const resetFilters = () => {
        setFilterOptions({
            category: 'all',
            priceRange: [0, 1000],
            brand: 'all',
            color: 'all',
            size: 'all',
        });
    };

    return (
        <div className="flex flex-col p-4 ">
            <h2 className="text-lg ml-4 font-semibold mb-4 text-gray-800">Bộ lọc</h2>
            <div className="bg-white p-4  rounded-xl shadow-lg">
                <div className="space-y-4">
                    <div>
                        <div
                            className="flex justify-between items-center mb-2 cursor-pointer"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        >
                            <label className="text-sm font-medium text-gray-700">Danh mục</label>
                            <FontAwesomeIcon
                                icon={isCategoryOpen ? faMinus : faPlus}
                                className="text-gray-500"
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                isCategoryOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {categories.map(category => (
                                <div className="flex items-center mb-2 ml-4" key={category}>
                                    <input
                                        type="radio"
                                        name="category"
                                        className="mr-2 text-blue-500 focus:ring-blue-500"
                                        id={`category-${category}`}
                                        checked={filterOptions.category === category}
                                        onChange={() => handleFilterChange('category', category)}
                                    />
                                    <label htmlFor={`category-${category}`} className="text-sm text-gray-600">
                                        {category === 'all' ? 'Tất cả' : category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div
                            className="flex justify-between items-center mb-2 cursor-pointer"
                            onClick={() => setIsBrandOpen(!isBrandOpen)}
                        >
                            <label className="text-sm font-medium text-gray-700">Thương hiệu</label>
                            <FontAwesomeIcon
                                icon={isBrandOpen ? faMinus : faPlus}
                                className="text-gray-500"
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                isBrandOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {brands.map(brand => (
                                <div className="flex items-center mb-2 ml-4" key={brand}>
                                    <input
                                        type="radio"
                                        name="brand"
                                        className="mr-2 text-blue-500 focus:ring-blue-500"
                                        id={`brand-${brand}`}
                                        checked={filterOptions.brand === brand}
                                        onChange={() => handleFilterChange('brand', brand)}
                                    />
                                    <label htmlFor={`brand-${brand}`} className="text-sm text-gray-600">
                                        {brand === 'all' ? 'Tất cả' : brand}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div
                            className="flex justify-between items-center mb-2 cursor-pointer"
                            onClick={() => setIsPriceOpen(!isPriceOpen)}
                        >
                            <label className="text-sm font-medium text-gray-700">Giá</label>
                            <FontAwesomeIcon
                                icon={isPriceOpen ? faMinus : faPlus}
                                className="text-gray-500"
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                isPriceOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {priceRanges.map(range => (
                                <div className="flex items-center mb-2 ml-4" key={range.label}>
                                    <input
                                        type="radio"
                                        name="price"
                                        className="mr-2 text-blue-500 focus:ring-blue-500"
                                        id={`price-${range.value.join('-')}`}
                                        checked={
                                            filterOptions.priceRange[0] === range.value[0] &&
                                            filterOptions.priceRange[1] === range.value[1]
                                        }
                                        onChange={() => handlePriceChange(range.value)}
                                    />
                                    <label
                                        htmlFor={`price-${range.value.join('-')}`}
                                        className="text-sm text-gray-600"
                                    >
                                        {range.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div
                            className="flex justify-between items-center mb-2 cursor-pointer"
                            onClick={() => setIsColorOpen(!isColorOpen)}
                        >
                            <label className="text-sm font-medium text-gray-700">Màu sắc</label>
                            <FontAwesomeIcon
                                icon={isColorOpen ? faMinus : faPlus}
                                className="text-gray-500"
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                isColorOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {colors.map(color => (
                                <div className="flex items-center mb-2 ml-4" key={color.name}>
                                    <input
                                        type="radio"
                                        name="color"
                                        className="mr-2 text-blue-500 focus:ring-blue-500"
                                        id={`color-${color.name}`}
                                        checked={filterOptions.color === color.name}
                                        onChange={() => handleFilterChange('color', color.name)}
                                    />
                                    {color.code && (
                                        <span
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{ backgroundColor: color.code }}
                                        />
                                    )}
                                    <label htmlFor={`color-${color.name}`} className="text-sm text-gray-600">
                                        {color.name === 'all' ? 'Tất cả' : color.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div
                            className="flex justify-between items-center mb-2 cursor-pointer"
                            onClick={() => setIsSizeOpen(!isSizeOpen)}
                        >
                            <label className="text-sm font-medium text-gray-700">Kích cỡ</label>
                            <FontAwesomeIcon
                                icon={isSizeOpen ? faMinus : faPlus}
                                className="text-gray-500"
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                isSizeOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {sizes.map(size => (
                                <div className="flex items-center mb-2 ml-4" key={size}>
                                    <input
                                        type="radio"
                                        name="size"
                                        className="mr-2 text-blue-500 focus:ring-blue-500"
                                        id={`size-${size}`}
                                        checked={filterOptions.size === size}
                                        onChange={() => handleFilterChange('size', size)}
                                    />
                                    <label htmlFor={`size-${size}`} className="text-sm text-gray-600">
                                        {size === 'all' ? 'Tất cả' : size}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                        >
                            Đặt lại
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterOptions({ ...filterOptions })}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Filter;