import React from 'react';

const WardSelect = ({ wards, selectedWard, onSelectWard }) => {
    return (
        <select value={selectedWard} onChange={(e) => onSelectWard(e.target.value)} disabled={wards.length === 0}>
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward, idx) => (
                <option key={idx} value={ward}>
                    {ward}
                </option>
            ))}
        </select>
    );
};

export default WardSelect;
