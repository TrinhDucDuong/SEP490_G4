import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const ProductInCartCard = ({ item, onRemove, onQuantityChange }) => {
    const { id, name, price, quantity, image, stock } = item;

    const increase = () => {
        if (quantity < stock) {
            onQuantityChange(id, quantity + 1);
        }
    };

    const decrease = () => {
        if (quantity > 1) {
            onQuantityChange(id, quantity - 1);
        }
    };

    return (
        <div className="flex gap-4 items-center border-b border-gray-300 py-4 text-sm sm:text-base">
            <div className="w-20 h-20 flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover rounded-md border"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full">
                <div className="flex justify-between">
                    <h3 className="font-semibold">{name}</h3>
                    <button
                        onClick={() => onRemove(id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <p className="text-gray-500 text-sm">
                    {price.toLocaleString('vi-VN')} VNĐ
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={decrease}
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        disabled={quantity <= 1}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="px-2">{quantity}</span>
                    <button
                        onClick={increase}
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        disabled={quantity >= stock}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductInCartCard;
