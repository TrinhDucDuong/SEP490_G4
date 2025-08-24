import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/common/admin/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            message,
            type,
            duration,
            isVisible: true
        };

        setToasts(prevToasts => [...prevToasts, newToast]);

        // Auto remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts(prevToasts =>
            prevToasts.map(toast =>
                toast.id === id ? { ...toast, isVisible: false } : toast
            )
        );

        // Remove from array after animation
        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, 300);
    };

    const showSuccess = (message) => showToast(message, 'success');
    const showError = (message) => showToast(message, 'error');

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, removeToast }}>
            {children}

            {/* Render all toasts */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    isVisible={toast.isVisible}
                    onClose={() => removeToast(toast.id)}
                    duration={0}
                />
            ))}
        </ToastContext.Provider>
    );
};
