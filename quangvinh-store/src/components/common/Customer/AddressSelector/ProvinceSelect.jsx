import React from 'react';

const ProvinceSelect = ({ provinces, selectedProvince, onSelectProvince }) => {
    return (
        <select value={selectedProvince} onChange={(e) => onSelectProvince(e.target.value)}>
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((province, idx) => (
                <option key={idx} value={province}>
                    {province}
                </option>
            ))}
        </select>
    );
};

export default ProvinceSelect;
