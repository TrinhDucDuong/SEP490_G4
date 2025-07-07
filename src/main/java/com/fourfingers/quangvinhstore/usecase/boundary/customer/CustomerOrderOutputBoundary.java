package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;

import java.util.List;

public interface CustomerOrderOutputBoundary {
    ListOrderOutputData convertToListCustomerOrderOutputData(List<Order> orders);
}
