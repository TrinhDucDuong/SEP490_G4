package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface CustomerOrderInputBoundary {
    ListOrderOutputData getOrders(UserDetails userDetails);
}
