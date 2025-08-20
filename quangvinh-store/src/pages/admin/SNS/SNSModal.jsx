import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SNSModal = ({
                      show,
                      onClose,
                      title,
                      children,
                      size = 'md',
                      onConfirm,
                      confirmText = 'Xác nhận',
                      cancelText = 'Hủy',
                      danger = false,
                      showFooter = true
                  }) => {
    // Prevent scroll when modal is open
    useEffect(() => {
        if (show) {
            // Lưu scroll position hiện tại
            const scrollY = window.scrollY;

            // Lock body scroll hoàn toàn
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';

            // Thêm class để override mọi CSS khác
            document.body.classList.add('modal-open');

            return () => {
                // Restore scroll position
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
                document.body.style.height = '';
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open');

                // Restore scroll position
                window.scrollTo(0, scrollY);
            };
        }
    }, [show]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27 && show) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc, false);

        return () => {
            document.removeEventListener('keydown', handleEsc, false);
        };
    }, [show, onClose]);

    if (!show) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 99999,
                margin: 0,
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col relative`}
                style={{
                    zIndex: 100000, // Cao hơn overlay
                    maxHeight: 'calc(100vh - 32px)',
                    margin: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0 bg-white sticky top-0">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Đóng"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    {children}
                </div>

                {/* Footer */}
                {showFooter && onConfirm && (
                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3 flex-shrink-0 sticky bottom-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                danger
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SNSModal;
