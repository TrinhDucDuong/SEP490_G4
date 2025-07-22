package com.fourfingers.quangvinhstore.usecase.boundary.staff;


import com.fourfingers.quangvinhstore.domain.model.staff.Order;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.OrderOutputData;

import java.util.List;

public interface OrderManagementOutputBoundary {
    ListOrderOutputData convertToListOrderOutputData(List<Order> orders);
    OrderOutputData createOrderOutputData(Order order);
}
