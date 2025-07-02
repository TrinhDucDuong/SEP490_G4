export const fetchCartAPI = async (accountId) => {
    const res = await fetch(`http://localhost:9999/cart/${accountId}`);
    if (!res.ok) throw new Error('Lỗi fetch giỏ hàng');
    return res.json();
};

export const addToCartAPI = async ({
                                       accountId,
                                       productId,
                                       colorHexCode,
                                       sizeCode,
                                       quantity
                                   }) => {
    const res = await fetch('http://localhost:9999/cart', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cartDetailsId: 0,
            accountId,
            productId,
            colorHexCode,
            sizeCode,
            quantity
        })
    });

    if (!res.ok) throw new Error('Lỗi thêm giỏ hàng');
    return res.json();
};
