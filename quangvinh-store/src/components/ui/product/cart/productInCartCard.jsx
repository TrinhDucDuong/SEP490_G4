import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetchProductById } from "../../../../hooks/customer/useFetchProducts.js";

/**
 * Component hiển thị sản phẩm trong giỏ hàng.
 *
 * Chức năng:
 * - Hiển thị ảnh, tên sản phẩm, màu sắc, kích thước
 * - Cho phép tăng/giảm số lượng
 * - Hiển thị tổng giá = đơn giá * số lượng
 * - Cho phép xóa sản phẩm khỏi giỏ hàng
 * - Nhấn vào ảnh để chuyển sang trang chi tiết sản phẩm
 *
 * @author ngothangwork
 * @component
 *
 * @param {Object} props - Props của component
 * @param {Object} props.item - Thông tin sản phẩm trong giỏ hàng
 * @param {number|string} props.item.productId - ID sản phẩm
 * @param {string} props.item.productName - Tên sản phẩm
 * @param {string} props.item.colorHexCode - Mã màu (hex)
 * @param {string} props.item.sizeCode - Size sản phẩm
 * @param {number} props.item.quantity - Số lượng trong giỏ hàng
 * @param {number} props.item.price - Giá sản phẩm
 * @param {Function} props.onRemove - Hàm callback khi xóa sản phẩm
 * @param {Function} props.onUpdateQuantity - Hàm callback khi cập nhật số lượng (+1 hoặc -1)
 *
 * @returns {JSX.Element} Giao diện sản phẩm trong giỏ hàng
 */

function ProductInCartCard({ item, onRemove, onUpdateQuantity }) {
    const navigate = useNavigate();

    const {
        productId,
        productName,
        colorHexCode,
        sizeCode,
        quantity,
        price,
    } = item;

    const { product, loading, error } = useFetchProductById(productId);

    const image =
        !loading && !error && product?.images?.length > 0
            ? product.images[0].imageUrl
            : null;

    const handleDecrease = () => {
        if (quantity > 1) {
            onUpdateQuantity(-1);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(1);
    };

    const handleImageClick = () => {
        if (product) {
            navigate("/products/detail", {
                state: { productId: product.productId },
            });
        }
    };

    return (
        <div className="flex items-start gap-4 border p-3 rounded-md shadow-sm">
            <img
                src={image}
                alt={productName}
                onClick={handleImageClick}
                className="w-16 h-16 object-cover rounded hover:opacity-90 transition cursor-pointer"
            />
            <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800">{productName}</h4>
                <div className="text-xs text-gray-500 mt-1">
                    Màu:
                    <span
                        className="inline-block w-3 h-3 rounded-full align-middle ml-1"
                        style={{ backgroundColor: colorHexCode }}
                    />
                    <span className="ml-3">Size: {sizeCode}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border rounded px-2 py-1 text-sm">
                        <button
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                            className="text-gray-600 hover:text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="mx-1">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="text-gray-600 hover:text-yellow-500"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">
                        {(price * quantity).toLocaleString('vi-VN')} ₫
                    </span>
                </div>
            </div>
            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Xóa"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}

export default ProductInCartCard;
