package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;

public interface CustomerOrderInputBoundary {
    ListOrderOutputData getOrders(UserDetails userDetails);

    BigDecimal placeOrders(UserDetails userDetails, ShippingAddressInputData shippingAddressInputData);
    
    BigDecimal getOrderPrice(UserDetails userDetails, Long orderId);

    boolean verifyCODOrder(UserDetails userDetails, Long orderId);
}

