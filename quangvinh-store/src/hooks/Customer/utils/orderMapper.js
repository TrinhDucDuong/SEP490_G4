export const mapSingleOrder = (order) => {
    const items = order.orderDetails.map((detail) => {
        const product = detail.productVariant.product;
        return {
            name: product.productName,
            price: detail.unitPrice,
            quantity: detail.quantity,
            size: detail.productVariant.productSize,
            colorHex: detail.productVariant.color?.colorHex || '#000',
        };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        estimatedDeliveryDate: null,
        shippingAddress: order.shippingAddress || null,
        paymentMethod: order.paymentMethod || 'Chưa cập nhật',
        items,
        subtotal,
        shippingFee: 0,
        voucherDiscount: 0,
        total: order.totalPrice || subtotal,
    };
};
