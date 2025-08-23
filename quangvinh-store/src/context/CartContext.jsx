import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
    fetchCartAPI,
    addToCartAPI,
    updateCartQuantityAPI,
    deleteCartItemAPI,
} from '../utils/api/Customer/CartAPI';
import { fetchProductById } from '../utils/api/Customer/ProductAPI';
import { toast } from 'react-toastify';

// Tạo Context để quản lý giỏ hàng
const CartContext = createContext();

// Hook tiện lợi để các component khác có thể dùng giỏ hàng
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ accountId, token, children }) => {
    // State lưu danh sách sản phẩm trong giỏ
    const [cartItems, setCartItems] = useState([]);
    // State quản lý loading
    const [loading, setLoading] = useState(true);
    // Ref dùng để kiểm tra đã đồng bộ giỏ hàng local với server chưa
    const syncedRef = useRef(false);

    // Lấy giỏ hàng từ localStorage
    const getLocalCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
    const saveLocalCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

    // Fetch giỏ hàng từ server và format lại dữ liệu
    const fetchAndFormatCartFromServer = async () => {
        const data = await fetchCartAPI(accountId, token);
        return data.cart.map((item) => ({
            id: item.cartDetailsId,
            productName: item.productVariant.product.productName,
            productImage: item.productVariant.product.images?.[0]?.imageUrl || '/placeholder.png',
            colorHexCode: item.productVariant.color.colorHex,
            sizeCode: item.productVariant.productSize,
            quantity: item.quantity,
            price: item.productVariant.product.unitPrice,
            productId: item.productVariant.product.productId,
        }));
    };

    // Đồng bộ giỏ hàng local với server nếu người dùng đã login
    const syncLocalCartToServer = async () => {
        const localCart = getLocalCart();
        if (!accountId || localCart.length === 0 || syncedRef.current) return;

        try {
            const serverData = await fetchCartAPI(accountId, token);
            const serverCart = serverData.cart || [];

            // Lặp qua các item local, thêm vào server nếu chưa có
            await Promise.all(
                localCart.map(async (localItem) => {
                    const matched = serverCart.find(
                        (item) =>
                            item.productVariant.product.productId === localItem.productId &&
                            item.productVariant.color.colorHex.toLowerCase() === localItem.colorHexCode.toLowerCase() &&
                            item.productVariant.productSize === localItem.sizeCode
                    );

                    await addToCartAPI({
                        accountId,
                        productId: localItem.productId,
                        colorHexCode: localItem.colorHexCode,
                        sizeCode: localItem.sizeCode,
                        quantity: localItem.quantity,
                        token,
                    });
                })
            );

            // Đánh dấu đã đồng bộ
            syncedRef.current = true;
            localStorage.removeItem('cart');
        } catch (err) {
            console.error('Lỗi đồng bộ giỏ hàng:', err);
            toast.error(err.message || 'Lỗi đồng bộ giỏ hàng');
        }
    };

    // Load giỏ hàng: nếu đã login thì lấy từ server, nếu chưa login lấy từ localStorage
    const loadCart = async () => {
        setLoading(true);
        try {
            if (accountId) {
                await syncLocalCartToServer();
                const formatted = await fetchAndFormatCartFromServer();
                setCartItems(formatted);
            } else {
                const localCart = getLocalCart();
                // Thêm thông tin sản phẩm đầy đủ nếu local cart thiếu dữ liệu
                const enrichedCart = await Promise.all(
                    localCart.map(async (item) => {
                        if (!item.productImage || item.productImage === '/placeholder.png') {
                            try {
                                const product = await fetchProductById(item.productId);
                                return {
                                    ...item,
                                    productName: product.productName,
                                    productImage: product.images?.[0]?.imageUrl || '/placeholder.png',
                                    price: product.unitPrice,
                                };
                            } catch (err) {
                                return item;
                            }
                        }
                        return item;
                    })
                );
                setCartItems(enrichedCart);
                saveLocalCart(enrichedCart);
            }
        } catch (err) {
            console.error('Lỗi tải giỏ hàng:', err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect để load giỏ hàng khi accountId hoặc token thay đổi
    useEffect(() => {
        loadCart();
    }, [accountId, token]);

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async ({
                                 productId,
                                 colorHexCode,
                                 sizeCode,
                                 quantity,
                                 productName,
                                 productImage,
                                 price,
                             }) => {
        try {
            if (accountId) {
                // Nếu login, thêm vào server
                await addToCartAPI({ accountId, productId, colorHexCode, sizeCode, quantity, token });
                const updated = await fetchAndFormatCartFromServer();
                setCartItems(updated);
            } else {
                // Nếu chưa login, lưu vào localStorage
                const localCart = getLocalCart();
                const existing = localCart.find(
                    (item) =>
                        item.productId === productId &&
                        item.colorHexCode?.toLowerCase() === colorHexCode?.toLowerCase() &&
                        item.sizeCode === sizeCode
                );

                let updatedCart;
                if (existing) {
                    // Nếu đã tồn tại, tăng số lượng
                    updatedCart = localCart.map((item) =>
                        item.productId === productId &&
                        item.colorHexCode?.toLowerCase() === colorHexCode?.toLowerCase() &&
                        item.sizeCode === sizeCode
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    // Nếu chưa tồn tại, thêm mới
                    const newItem = {
                        id: `local_${Date.now()}`,
                        productId,
                        productName,
                        productImage,
                        colorHexCode,
                        sizeCode,
                        quantity,
                        price,
                    };
                    updatedCart = [...localCart, newItem];
                }

                setCartItems(updatedCart);
                saveLocalCart(updatedCart);
            }
        } catch (err) {
            console.error('Lỗi thêm vào giỏ hàng:', err);
            toast.error(err.message || 'Lỗi thêm vào giỏ hàng');
        }
    };

    // Cập nhật số lượng sản phẩm trong giỏ
    const updateQuantity = async (id, newQuantity) => {
        try {
            if (accountId) {
                const item = cartItems.find((i) => i.id === id);
                if (!item) throw new Error('Không tìm thấy sản phẩm');

                if (newQuantity === item.quantity) return;

                if (newQuantity > item.quantity) {
                    const delta = newQuantity - item.quantity;
                    await addToCartAPI({ accountId, productId: item.productId, colorHexCode: item.colorHexCode, sizeCode: item.sizeCode, quantity: delta, token });
                } else {
                    await updateCartQuantityAPI({ cartDetailsId: id, accountId, productId: item.productId, colorHexCode: item.colorHexCode, sizeCode: item.sizeCode, quantity: item.quantity - newQuantity, token });
                }

                const updated = await fetchAndFormatCartFromServer();
                setCartItems(updated);
            } else {
                const updated = getLocalCart().map((i) => i.id === id ? { ...i, quantity: newQuantity } : i);
                setCartItems(updated);
                saveLocalCart(updated);
            }
        } catch (err) {
            console.error('Lỗi cập nhật số lượng:', err);
            toast.error(err.message || 'Lỗi cập nhật số lượng');
        }
    };

    // Xóa 1 sản phẩm khỏi giỏ
    const removeItem = async (id) => {
        try {
            if (accountId) {
                const item = cartItems.find((i) => i.id === id);
                if (!item) throw new Error('Không tìm thấy sản phẩm');
                await updateCartQuantityAPI({ cartDetailsId: id, accountId, productId: item.productId, colorHexCode: item.colorHexCode, sizeCode: item.sizeCode, quantity: item.quantity, token });
                const updated = await fetchAndFormatCartFromServer();
                setCartItems(updated);
            } else {
                const updated = getLocalCart().filter((i) => i.id !== id);
                setCartItems(updated);
                saveLocalCart(updated);
            }
        } catch (err) {
            console.error('Lỗi xóa sản phẩm:', err);
            toast.error(err.message || 'Lỗi xóa sản phẩm');
        }
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = async () => {
        try {
            setCartItems([]);
            localStorage.removeItem('cart');
            if (accountId) {
                const data = await fetchCartAPI(accountId, token);
                await Promise.all(
                    (data.cart || []).map((item) => deleteCartItemAPI(item.cartDetailsId, token))
                );
            }
        } catch (err) {
            console.error('Lỗi xóa giỏ hàng:', err);
        }
    };

    // Trả về Context Provider với các giá trị và hàm thao tác giỏ hàng
    return (
        <CartContext.Provider
            value={{ cartItems, loading, addToCart, updateQuantity, removeItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
