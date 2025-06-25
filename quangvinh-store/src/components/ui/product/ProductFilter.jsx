// ProductFilter.jsx
import React, { useState, useEffect } from "react";
import ShowSection from "../../common/ShowSection.jsx";
import { useFetchBrands } from "../../../hooks/useFetchBrands.js";
import FilterGroup from "./FilterGroup.jsx";
import ColorFilterGroup from "./ColorFilterGroup.jsx";
import SizeFilterGroup from "./SizeFilterGroup.jsx";
import PriceRangeFilter from "./PriceRangeFilter.jsx";


const ProductFilter = ({filterOptions, setFilterOptions }) => {
    const [localFilters, setLocalFilters] = useState({ ...filterOptions });
    const [sectionVisibility, setSectionVisibility] = useState({
        genders: true,
        brands: true,
        materials: true,
        sizes: true,
        colors: true,
        price: true,
    });

    const { brands, loading: brandsLoading } = useFetchBrands();

    const toggleSection = (key) => {
        setSectionVisibility((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    useEffect(() => {
        setLocalFilters({ ...filterOptions });
    }, [filterOptions]);

    const handleApplyFilters = () => {
        setFilterOptions(localFilters);
    };

    const handleResetFilters = () => {
        const cleared = {
            genders: [],
            brands: [],
            materials: [],
            sizes: [],
            colors: [],
            priceMin: 150000,
            priceMax: 3000000,
            sortBy: "createdAt",
            sortDirection: "desc",
            pageNumber: 0,
            pageSize: 10,
        };
        setLocalFilters(cleared);
        setFilterOptions(cleared);
    };

    const updateField = (key, selected) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: selected,
        }));
    };

    const materialOptions = [
        "COTTON",
        "DENIM",
        "NYLON",
        "RECYCLED NYLON",
        "RECYCLED POLYESTER",
    ];
    const sizeOptions = ["34\"", "36\"", "38\"", "40\"", "42\""];
    const colorOptions = ["#4169e1", "#ffa500", "#000000", "#2e8b57", "#333333", "#d2691e", "#c0c0c0", "#708090", "#8b4513"];
    const genderOptions = ["NAM GIỘI", "NỬ GIỘI", "BÉ TRAI", "BÉ GÁI"];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">BỘ LỌC</h2>

            <ShowSection label="PHÂN LOẠI SẢN PHẨM" show={sectionVisibility.genders} onToggle={() => toggleSection("genders")}>
                <FilterGroup label="Giới tính" options={genderOptions} selectedOptions={localFilters.genders} onChange={(selected) => updateField("genders", selected)} />
            </ShowSection>

            <ShowSection label="THƯƠNG HIỆU" show={sectionVisibility.brands} onToggle={() => toggleSection("brands")}>
                {brandsLoading ? (
                    <p className="text-gray-500">...Đang tải thương hiệu</p>
                ) : (
                    <FilterGroup
                        label="Thương hiệu"
                        options={brands.map((b) => ({ label: b.brandName, value: b.brandId }))}
                        selectedOptions={localFilters.brands}
                        onChange={(selected) => updateField("brands", selected)}
                    />
                )}
            </ShowSection>

            <ShowSection label="CHẤT LIỆU" show={sectionVisibility.materials} onToggle={() => toggleSection("materials")}>
                <FilterGroup label="Chất liệu" options={materialOptions} selectedOptions={localFilters.materials} onChange={(selected) => updateField("materials", selected)} />
            </ShowSection>

            <ShowSection label="KÍCH CỠ" show={sectionVisibility.sizes} onToggle={() => toggleSection("sizes")}>
                <SizeFilterGroup options={sizeOptions} selectedOptions={localFilters.sizes} onChange={(selected) => updateField("sizes", selected)} />
            </ShowSection>

            <ShowSection label="MÀU SẮC" show={sectionVisibility.colors} onToggle={() => toggleSection("colors")}>
                <ColorFilterGroup colors={colorOptions} selectedColors={localFilters.colors} onChange={(selected) => updateField("colors", selected)} />
            </ShowSection>

            <ShowSection label="KHOẢNG GIÁ" show={sectionVisibility.price} onToggle={() => toggleSection("price")}>
                <PriceRangeFilter min={150000} max={3000000} values={[localFilters.priceMin, localFilters.priceMax]} onChange={([min, max]) => {
                    updateField("priceMin", min);
                    updateField("priceMax", max);
                }} />
            </ShowSection>

            <div className="pt-4 flex gap-4">
                <button onClick={handleApplyFilters} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    Áp dụng
                </button>
                <button onClick={handleResetFilters} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                    Đặt lại
                </button>
            </div>
        </div>
    );
};

export default ProductFilter;
