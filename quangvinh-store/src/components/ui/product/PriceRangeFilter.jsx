import React, { useState, useEffect, useCallback } from "react";
import "./PriceRangeFilter.css";

const PriceRangeFilter = ({ min = 0, max = 1000000, values = [0, 1000000], onChange = () => {} }) => {
    const [minVal, setMinVal] = useState(Number(values[0]) || min);
    const [maxVal, setMaxVal] = useState(Number(values[1]) || max);

    useEffect(() => {
        const newMin = Number(values[0]) || min;
        const newMax = Number(values[1]) || max;
        setMinVal(newMin);
        setMaxVal(newMax);
    }, [values, min, max]);

    const handleMinChange = useCallback((e) => {
        const val = Math.min(Number(e.target.value), maxVal - 100000);
        setMinVal(val);
        onChange([val, maxVal]);
    }, [maxVal, onChange]);

    const handleMaxChange = useCallback((e) => {
        const val = Math.max(Number(e.target.value), minVal + 100000);
        setMaxVal(val);
        onChange([minVal, val]);
    }, [minVal, onChange]);

    // Tính toán phần trăm cho slider-range, đảm bảo không chia cho 0
    const rangeLeft = max > min ? ((minVal - min) / (max - min)) * 100 : 0;
    const rangeRight = max > min ? 100 - ((maxVal - min) / (max - min)) * 100 : 0;

    return (
        <div className="price-range-slider">
            <div className="range-values">
                <span>{(minVal || 0).toLocaleString('vi-VN')}đ</span>
                <span>{(maxVal || 0).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="slider-container">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={10000}
                    value={minVal}
                    onChange={handleMinChange}
                    className="thumb thumb-left"
                    aria-label="Giá tối thiểu"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={10000}
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="thumb thumb-right"
                    aria-label="Giá tối đa"
                />
                <div className="slider-track" />
                <div
                    className="slider-range"
                    style={{
                        left: `${rangeLeft}%`,
                        right: `${rangeRight}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default PriceRangeFilter;