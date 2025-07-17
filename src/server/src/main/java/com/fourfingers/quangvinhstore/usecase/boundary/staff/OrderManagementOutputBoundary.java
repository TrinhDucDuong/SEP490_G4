package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;

import java.util.List;

public interface OrderManagementOutputBoundary {
    ListOrderOutputData convertToListOrderOutputData(List<Order> orders);
    OrderOutputData createOrderOutputData(Order order);
}
