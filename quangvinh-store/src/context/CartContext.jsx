// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCartAPI, addToCartAPI } from '../utils/api/CartAPI';
import { useAuth } from './useAuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const accountId = user?.account?.accountId;

    useEffect(() => {
        if (accountId) {
            fetchCart();
        }
    }, [accountId]);

    const fetchCart = async () => {
        try {
            const data = await fetchCartAPI(accountId);
            setCartItems(data);
        } catch (err) {
            console.error('Lỗi khi load giỏ hàng:', err);
        }
    };

    const addToCart = async (item) => {
        await addToCartAPI({ ...item, accountId });
        fetchCart();
    };

    const updateQuantity = (id, quantity) => {
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity } : item)
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                removeItem,
                updateQuantity,
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
