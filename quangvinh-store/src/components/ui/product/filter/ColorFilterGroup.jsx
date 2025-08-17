import React from "react";

const ColorFilterGroup = ({ colors = [], selectedColors = [], onChange }) => {
    const handleToggle = (color) => {
        if (selectedColors.includes(color)) {
            onChange(selectedColors.filter(c => c !== color));
        } else {
            onChange([...selectedColors, color]);
        }
    };

    return (
        <div className="grid grid-cols-6 gap-2">
            {colors.map(color => (
                <button
                    key={color}
                    onClick={() => handleToggle(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 
                        ${selectedColors.includes(color) ? 'ring-2 ring-black' : 'ring-0'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                    type="button"
                />
            ))}
        </div>
    );
};

export default ColorFilterGroup;
