package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Order;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatusEnum;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.order.ProcessOrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.order.OrderOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

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
    public OrderOutputData processOrder(String id, ProcessOrderInputData processOrderInputData) {
        UUID orderId = UUID.fromString(id);
        OrderEntity orderEntity = orderRepository.findById(orderId).orElseThrow(
                () -> new RuntimeException("Order not found")
        );
        orderEntity.setOrderStatus(OrderStatusEnum.PREPARING);
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
                orderRepository.findAllByOrderStatus(OrderStatusEnum.valueOf(orderStatus))
                        .stream()
                        .map(orderMapper::toModel)
                        .toList();
    }


}
