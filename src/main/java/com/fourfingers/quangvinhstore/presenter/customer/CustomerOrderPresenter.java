package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerOrderPresenter implements CustomerOrderOutputBoundary {
    @Override
    public ListOrderOutputData convertToListCustomerOrderOutputData(List<Order> orders) {
        return new ListOrderOutputData(orders);
    }

    @Override
    public OrderOutputData convertToCustomerOrderOutputData(Order order) {
        return new OrderOutputData(order);
    }
}
