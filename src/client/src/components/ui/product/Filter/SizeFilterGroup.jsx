import React from "react";

const SizeFilterGroup = ({ options = [], selectedOptions = [], onChange }) => {
    const handleToggle = (value) => {
        if (selectedOptions.includes(value)) {
            onChange(selectedOptions.filter(item => item !== value));
        } else {
            onChange([...selectedOptions, value]);
        }
    };

    return (
        <div className="grid grid-cols-4 gap-2">
            {options.map(size => (
                <button
                    key={size}
                    onClick={() => handleToggle(size)}
                    className={`px-2 py-1 rounded border text-sm 
                        ${selectedOptions.includes(size) ? 'bg-black text-white' : 'bg-white text-black'}`}
                    type="button"
                >
                    {size}
                </button>
            ))}
        </div>
    );
};

export default SizeFilterGroup;
