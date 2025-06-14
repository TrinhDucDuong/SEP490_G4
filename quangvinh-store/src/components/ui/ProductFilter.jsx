import { useState, useEffect } from "react";
import { useFetchCategories } from "../../hooks/useFetch.js";
import { X, SlidersHorizontal } from "lucide-react";

function ProductFilter({ initialOptions, onApply, onClose }) {
    const { categories, loading, error } = useFetchCategories();
    const [category, setCategory] = useState(initialOptions.category || "all");
    const [priceRange, setPriceRange] = useState(initialOptions.priceRange || [0, 1000]);
    const [color, setColor] = useState(initialOptions.color || "all");
    const [size, setSize] = useState(initialOptions.size || "all");
    const colors = ["all", "Red", "Blue", "Green", "Black", "White"];
    const sizes = ["all", "XS", "S", "M", "L", "XL"];

    useEffect(() => {
        setCategory(initialOptions.category || "all");
        setPriceRange(initialOptions.priceRange || [0, 1000]);
        setColor(initialOptions.color || "all");
        setSize(initialOptions.size || "all");
    }, [initialOptions]);

    const handleApply = () => {
        onApply({ category, priceRange, color, size });
    };

    const handlePriceChange = (e, index) => {
        const newRange = [...priceRange];
        newRange[index] = Number(e.target.value);
        if (newRange[0] > newRange[1]) [newRange[0], newRange[1]] = [newRange[1], newRange[0]];
        setPriceRange(newRange);
    };

    const handleReset = () => {
        setCategory("all");
        setPriceRange([0, 1000]);
        setColor("all");
        setSize("all");
    };
    return (
        <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl p-6 fixed top-0 left-0 z-50">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                    <h3 className="text-xl font-semibold">Bộ lọc sản phẩm</h3>
                </div>
                <button onClick={onClose} aria-label="Đóng bộ lọc" className="text-gray-600 hover:text-black">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {loading && <p className="text-gray-500">Đang tải danh mục...</p>}
            {error && <p className="text-red-500">Lỗi tải danh mục: {error}</p>}

            {!loading && !error && (
                <div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium">Danh mục</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg py-3 px-4 bg-white text-gray-900"
                        >
                            <option value="all">Tất cả</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium">Màu sắc</label>
                        <select
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg py-3 px-4 bg-white text-gray-900"
                        >
                            {colors.map((col) => (
                                <option key={col} value={col}>{col === "all" ? "Tất cả" : col}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kích thước */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium">Kích thước</label>
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg py-3 px-4 bg-white text-gray-900"
                        >
                            {sizes.map((sz) => (
                                <option key={sz} value={sz}>{sz === "all" ? "Tất cả" : sz}</option>
                            ))}
                        </select>
                    </div>

                    {/* Khoảng giá */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium">
                            Khoảng giá (${priceRange[0]} - ${priceRange[1]})
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange(e, 0)}
                                className="w-full accent-gray-900"
                            />
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(e, 1)}
                                className="w-full accent-gray-900"
                            />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleApply}
                            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800"
                        >
                            Áp dụng bộ lọc
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300"
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductFilter;