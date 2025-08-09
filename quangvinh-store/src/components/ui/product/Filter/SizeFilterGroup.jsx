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
            {options.map(({ label, value }) => (
                <button
                    key={value}
                    onClick={() => handleToggle(value)}
                    className={`px-2 py-1 rounded border text-sm 
                        ${selectedOptions.includes(value) ? 'bg-black text-white' : 'bg-white text-black'}`}
                    type="button"
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default SizeFilterGroup;
