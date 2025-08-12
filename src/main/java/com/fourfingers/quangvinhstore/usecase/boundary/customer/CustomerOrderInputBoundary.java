package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ProductVariantInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.PurchaseInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressIdInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;

public interface CustomerOrderInputBoundary {
    ListOrderOutputData getOrders(UserDetails userDetails);

    OrderOutputData placeOrders(UserDetails userDetails, ShippingAddressIdInputData shippingAddressIdInputData);

    OrderOutputData placeOrderPayLater(UserDetails userDetails, PurchaseInputData purchaseInputData);

    OrderOutputData getOrder(Long orderId, UserDetails userDetails);

    OrderOutputData verifyAndPlaceOrderPayInAdvance(Map<String, String> map);

    void setSecureHash(Long orderId, String secureHash);

    OrderOutputData orderNow(OrderInputData orderInputData, UserDetails userDetails);

    OrderOutputData chooseShippingAddress(UserDetails userDetails, ShippingAddressIdInputData shippingAddressIdInputData, Long orderId);

    OrderOutputData orderByGuest(ShippingAddressInputData shippingAddressInputData, List<ProductVariantInputData> listOrderInputData, String paymentMethod);

    OrderOutputData trackingOrder(Long id);
}

