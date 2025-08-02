import React from 'react';

export const Card = ({children, className = '', ...props}) => {
    return (
        <div
            className={`border border-gray-200 bg-white p-1 shadow ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
