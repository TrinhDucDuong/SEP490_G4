import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ type, message, isVisible, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const baseClasses = "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform";

    const typeClasses = {
        success: "bg-green-500 text-white border-l-4 border-green-600",
        error: "bg-red-500 text-white border-l-4 border-red-600"
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 flex-shrink-0" />
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {icons[type]}
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
