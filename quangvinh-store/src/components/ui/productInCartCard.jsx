// src/components/ui/ProductInCartCard.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function ProductInCartCard({ item, onRemove, onUpdateQuantity }) {
    const {
        id,
        productImage,
        productName,
        colorHexCode,
        sizeCode,
        quantity,
        price
    } = item;

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity > 0) {
            onUpdateQuantity(id, newQuantity);
        }
    };

    return (
        <div className="flex gap-4 border p-3 rounded-lg shadow-sm hover:shadow-md transition">
            <img
                src={productImage || '/placeholder.png'}
                alt={productName}
                className="w-20 h-20 object-cover rounded-lg border"
                loading="lazy"
            />

            <div className="flex-1 flex flex-col justify-between text-sm">
                <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">{productName}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                        Màu: <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle mr-1"
                        style={{ backgroundColor: colorHexCode }}
                    />
                        <span className="align-middle">{colorHexCode}</span>
                    </p>
                    <p className="text-xs text-gray-600">Kích thước: {sizeCode}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded overflow-hidden">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="px-3 py-1 text-gray-600 hover:text-black"
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="px-3">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="px-3 py-1 text-gray-600 hover:text-black"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-base font-semibold text-red-600 whitespace-nowrap">
                            {(price * quantity).toLocaleString('vi-VN')}₫
                        </p>
                        <button
                            onClick={() => onRemove(id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Xóa khỏi giỏ hàng"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductInCartCard;