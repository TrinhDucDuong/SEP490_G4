package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.Order;
import com.fourfingers.quangvinhstore.usecase.data.output.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.order.OrderOutputData;

import java.util.List;

public interface OrderManagementOutputBoundary {
    ListOrderOutputData convertToListOrderOutputData(List<Order> orders);
    OrderOutputData createOrderOutputData(Order order);
}
