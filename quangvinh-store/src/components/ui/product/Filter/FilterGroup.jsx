import React from "react";

const FilterGroup = ({ label, options, selectedOptions = [], onChange }) => {
    const handleToggle = (value) => {
        if (selectedOptions.includes(value)) {
            onChange(selectedOptions.filter(item => item !== value));
        } else {
            onChange([...selectedOptions, value]);
        }
    };

    return (
        <div className="space-y-2">
            {options.map(option => {
                const labelText = typeof option === 'object' ? option.label : option;
                const value = typeof option === 'object' ? option.value : option;
                return (
                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="accent-black"
                            checked={selectedOptions.includes(value)}
                            onChange={() => handleToggle(value)}
                        />
                        <span>{labelText}</span>
                    </label>
                );
            })}
        </div>
    );
};

export default FilterGroup;
