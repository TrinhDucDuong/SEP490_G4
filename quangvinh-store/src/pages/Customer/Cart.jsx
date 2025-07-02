import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import ProductInCartCard from '../../components/ui/productInCartCard.jsx';

function Cart({ isOpen, onClose }) {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 2 },
        { id: 2, name: 'Sản phẩm B', price: 150000, quantity: 1 },
        { id: 3, name: 'Sản phẩm C', price: 200000, quantity: 3 },
    ]);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-[80vw] sm:w-80 lg:w-96 bg-white text-black transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-50 shadow-lg`}>
            <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold tracking-tight">🛒 Giỏ hàng</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-yellow-400 active:text-yellow-500 text-lg"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                    {cartItems.length} sản phẩm trong giỏ hàng
                </div>
                <div className="flex-1 overflow-y-auto pr-1">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-20">
                            <FontAwesomeIcon icon={faCartShopping} size="3x" className="mb-4" />
                            <p className="text-base font-medium">Giỏ hàng trống</p>
                            <p className="text-sm mt-1">Hãy thêm một vài món nhé!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map(item => (
                                <ProductInCartCard
                                    key={item.id}
                                    item={item}
                                    onRemove={removeItem}
                                    onUpdateQuantity={(id, newQty) => {
                                        setCartItems(prev =>
                                            prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="pt-4 border-t mt-4">
                        <div className="flex justify-between items-center mb-4 text-base font-semibold">
                            <span>Tổng cộng:</span>
                            <span className="text-yellow-600">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <Link
                            to="/payment"
                            onClick={onClose}
                            className="block w-full text-center bg-yellow-400 text-black py-3 rounded-lg font-semibold text-sm hover:bg-yellow-500 transition"
                        >
                            Thanh Toán Ngay
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
