import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`rounded-lg border border-gray-200 bg-white p-4 shadow ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
