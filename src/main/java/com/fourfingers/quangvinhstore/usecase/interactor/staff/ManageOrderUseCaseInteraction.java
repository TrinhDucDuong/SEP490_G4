package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProcessOrderInputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageOrderUseCaseInteraction implements OrderManagementInputBoundary {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderManagementOutputBoundary orderManagementOutputBoundary;

    @Override
    @Transactional
    public ListOrderOutputData getAll(String orderStatus, String sortBy, String sortDirection) {
        Sort sort = Sort.by(
                sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy
        );
        List<Order> orders = getListOrder(orderStatus, sort);
        return orderManagementOutputBoundary.convertToListOrderOutputData(orders);
    }

    @Override
    public OrderOutputData processOrder(String id, ProcessOrderInputData processOrderInputData, UserDetails userDetails) {
        Long orderId = Long.parseLong(id);
        OrderEntity orderEntity = orderRepository.findById(orderId).orElseThrow(
                () -> new RuntimeException("Order not found")
        );
        //TODO: Fix this
        orderEntity.setOrderStatus(OrderStatus.PREPARING);
        orderEntity.setProcessBy((AccountEntity) userDetails);
        return orderManagementOutputBoundary.createOrderOutputData(
                orderMapper.toModel(orderRepository.save(orderEntity))
        );
    }

    protected List<Order> getListOrder(String orderStatus, Sort sort) {
        return (orderStatus == null || orderStatus.isBlank()) ?
                orderRepository.findAll(sort)
                        .stream()
                        .map(orderMapper::toModel)
                        .toList()
                :
                orderRepository.findAllByOrderStatus(OrderStatus.valueOf(orderStatus))
                        .stream()
                        .map(orderMapper::toModel)
                        .toList();
    }
}
