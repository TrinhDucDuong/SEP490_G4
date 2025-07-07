package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CustomerOrderUseCaseInteraction implements CustomerOrderInputBoundary {
    private final CustomerOrderOutputBoundary customerOrderOutputBoundary;
    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;

    @Override
    public ListOrderOutputData getOrders(//UserDetails userDetails
                                         Long accountId ) {
//        AccountEntity accountEntity = (AccountEntity) userDetails;
        return customerOrderOutputBoundary.convertToListCustomerOrderOutputData(
                orderRepository.findAllByOwnerAccountId(//accountEntity.getAccountId()
                                accountId )
                        .stream()
                        .map(orderEntity -> {
                            orderEntity.getOrderDetails().size();
                            return orderMapper.toModel(orderEntity);
                        })
                        .toList()
        );
    }

}
