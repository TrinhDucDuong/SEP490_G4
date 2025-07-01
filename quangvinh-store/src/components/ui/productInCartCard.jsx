import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import productPicture from '../../assets/images/ao.png';

function ProductInCartCard({ item, onRemove, onUpdateQuantity }) {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            onUpdateQuantity?.(item.id, quantity - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        onUpdateQuantity?.(item.id, quantity + 1);
    };

    return (
        <div className="flex items-center border border-gray-200 rounded-lg p-3 hover:shadow-sm transition mb-3 group">
            <Link to={`/product/${item.id}`} className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-100 hover:opacity-80 transition">
                <img
                    src={item.imageUrl || productPicture}
                    alt={item.name}
                    className="object-cover w-full h-full"
                    onError={(e) => (e.target.src = productPicture)}
                />
            </Link>

            <div className="flex-1 px-4">
                <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-sm text-black line-clamp-2 hover:text-yellow-600 transition">
                        {item.name}
                    </h3>
                </Link>
                <div className="text-gray-600 text-xs mt-1">
                    Giá:{" "}
                    {item.discountPrice ? (
                        <>
                            <span className="text-red-500 font-semibold mr-2">
                                {item.discountPrice.toLocaleString()}đ
                            </span>
                            <span className="line-through text-gray-400">
                                {item.price.toLocaleString()}đ
                            </span>
                        </>
                    ) : (
                        <span className="text-black font-medium">
                            {item.price.toLocaleString()}đ
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={handleDecrease}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="w-6 text-center text-sm">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition ml-2"
                title="Xóa khỏi giỏ hàng"
            >
                <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
        </div>
    );
}

export default ProductInCartCard;
