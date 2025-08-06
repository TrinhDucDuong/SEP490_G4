// src/pages/Staff/Banner/BannerCard.jsx
import React from 'react';
import { BANNER_HELPERS } from '../../../utils/constants/BannerConstants';

const BannerCard = ({ banner, onStatusToggle, disabled = false }) => {
    const handleStatusToggle = () => {
        if (!disabled) {
            onStatusToggle(banner.imageId, banner.isActive);
        }
    };

    return (
        <div className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Banner Image */}
            <div className="aspect-video w-full overflow-hidden">
                <img
                    src={banner.imageUrl}
                    alt={`Banner ${banner.imageId}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                />
            </div>

            {/* Status Button - Ở góc phải trên - CẢ O VÀ X ĐỀU CÓ THỂ CLICK */}
            <button
                onClick={handleStatusToggle}
                disabled={disabled}
                className={`
                    absolute top-3 right-3 w-8 h-8 rounded-full font-bold text-sm
                    flex items-center justify-center shadow-lg transition-all duration-200
                    ${banner.isActive
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }
                    ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-110 active:scale-95 cursor-pointer hover:shadow-xl'
                }
                `}
                title={banner.isActive
                    ? 'Nhấn để tạm dừng banner (O → X)'
                    : 'Nhấn để kích hoạt banner (X → O)'
                }
            >
                {banner.isActive ? 'O' : 'X'}
            </button>

            {/* Status Overlay khi banner bị tạm dừng */}
            {!banner.isActive && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Đã tạm dừng
                    </span>
                </div>
            )}
        </div>
    );
};

export default BannerCard;
