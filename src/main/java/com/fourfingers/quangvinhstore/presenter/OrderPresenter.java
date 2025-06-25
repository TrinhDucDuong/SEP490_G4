package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.order.OrderOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderPresenter implements OrderManagementOutputBoundary {
    @Override
    public ListOrderOutputData convertToListOrderOutputData(List<Order> orders) {
        return new ListOrderOutputData(orders);
    }

    @Override
    public OrderOutputData createOrderOutputData(Order order) {
        return new OrderOutputData(order);
    }
}
