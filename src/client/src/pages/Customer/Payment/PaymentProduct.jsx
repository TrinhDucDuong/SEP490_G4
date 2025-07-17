import ProductInCartCard from "../../../components/ui/product/Cart/productInCartCard.jsx";
import { toast } from "react-toastify";
import React, { useState } from "react";

function PaymentProduct({ cartItems, promoList, removeItem, updateQuantity }) {
    const [selectedPromo, setSelectedPromo] = useState('');

    const totalPrice = cartItems.reduce((sum, item) => {
        const price = item.productVariant?.product?.unitPrice || item.price || 0;
        return sum + price * item.quantity;
    }, 0);

    return (
        <>
            <div className='rounded-lg shadow-md p-4 mb-6 bg-white'>
                <h2 className='text-xl font-bold mb-4 text-black'>Tóm Tắt Đơn Hàng</h2>

                <div className='text-sm mb-6 text-black'>
                    <div className='flex justify-between mb-1'>
                        <span>{cartItems.length} Sản phẩm</span>
                        <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className='flex justify-between font-bold mb-1'>
                        <span>Tổng cộng</span>
                        <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>

                {promoList && promoList.length > 0 && (
                    <div className='flex flex-col gap-2 mb-4'>
                        <label className='text-sm text-black'>Chọn mã khuyến mãi</label>
                        <select
                            className='border px-3 py-2 rounded-full text-black'
                            value={selectedPromo}
                            onChange={(e) => setSelectedPromo(e.target.value)}
                        >
                            <option value=''>-- Chọn mã --</option>
                            {promoList.map((code) => (
                                <option key={code} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className='rounded-lg shadow-md mt-6 p-4 bg-white'>
                <h3 className='font-semibold mb-2 text-black'>
                    Chi tiết đơn hàng ({cartItems.length})
                </h3>

                {cartItems.map((item) => (
                    <ProductInCartCard
                        key={item.id}
                        item={item}
                        onRemove={() => removeItem(item.id)}
                        onUpdateQuantity={(delta) => {
                            const current = cartItems.find(i => i.id === item.id);
                            if (!current) return;
                            const newQty = current.quantity + delta;
                            if (newQty > 0) {
                                updateQuantity(item.id, newQty);
                            } else {
                                toast.warn('Số lượng tối thiểu là 1');
                            }
                        }}
                    />
                ))}
            </div>
        </>
    );
}

export default PaymentProduct;
