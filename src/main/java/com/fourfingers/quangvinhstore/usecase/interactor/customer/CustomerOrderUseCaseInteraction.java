package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CustomerOrderUseCaseInteraction implements CustomerOrderInputBoundary {
    private final CustomerOrderOutputBoundary customerOrderOutputBoundary;
    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;
    private final CartDetailsRepository cartDetailsRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final ShippingAddressUseCaseInteraction shippingAddressUseCaseInteraction;
    private final OrderDetailsRepository orderDetailsRepository;

    @Override
    public ListOrderOutputData getOrders(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        return customerOrderOutputBoundary.convertToListCustomerOrderOutputData(
                orderRepository.findAllByOwnerAccountId(accountEntity.getAccountId())
                        .stream()
                        .map(orderEntity -> {
                            orderEntity.getOrderDetails().size();
                            return orderMapper.toModel(orderEntity);
                        })
                        .toList()
        );
    }

    @Override
    public BigDecimal placeOrders(UserDetails userDetails, ShippingAddressInputData shippingAddressInputData) throws RuntimeException {
        AccountEntity accountEntity = (AccountEntity) userDetails;

        ShippingAddressEntity shippingAddressEntity = null;
        if (shippingAddressInputData.getShippingAddressId() == null) {
            shippingAddressUseCaseInteraction.saveNewShippingAddress(accountEntity, shippingAddressInputData);
            List<ShippingAddressEntity> shippingAddressEntities = shippingAddressRepository.findAllByAccount_AccountId(accountEntity.getAccountId());
            shippingAddressEntity = shippingAddressEntities.get(shippingAddressEntities.size() - 1);
        } else {
            Optional<ShippingAddressEntity> existingEntityOpt = shippingAddressRepository
                    .findByAccount_AccountIdAndShippingAddressId(
                            accountEntity.getAccountId(),
                            shippingAddressInputData.getShippingAddressId()
                    );
            if (existingEntityOpt.isPresent()) {
                shippingAddressEntity = existingEntityOpt.get();
            }
        }

        if (shippingAddressEntity == null) {
            throw new RuntimeException("Shipping address not found");
        }

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderDate(LocalDateTime.now());
        orderEntity.setOwner(accountEntity);
        orderEntity.setShippingAddress(shippingAddressEntity);

        orderEntity.setOrderStatus(OrderStatus.PREPARING);

        List<CartDetailsEntity> cartDetailsEntities = cartDetailsRepository.findByAccount_AccountId(accountEntity.getAccountId());
        List<OrderDetailsEntity> orderDetailsEntities = mapCartDetailsEntityToOrderDetailsEntity(cartDetailsEntities, orderEntity);
        orderEntity.setOrderDetails(orderDetailsEntities);

        orderRepository.save(orderEntity);
        cartDetailsRepository.deleteByAccount_AccountId(accountEntity.getAccountId());

        return calculateTotalOrderPrice(orderEntity.getOrderId(), accountEntity.getAccountId());
    }


    private List<OrderDetailsEntity> mapCartDetailsEntityToOrderDetailsEntity(List<CartDetailsEntity> cartDetailsList, OrderEntity order) {
        return cartDetailsList.stream()
                .map(cartDetails -> OrderDetailsEntity.builder()
                        .order(order)
                        .productVariant(cartDetails.getProductVariant())
                        .quantity(cartDetails.getQuantity().longValue())
                        .unitPrice(cartDetails.getProductVariant().getProduct().getDiscountedPrice())
                        .build())
                .collect(Collectors.toList());
    }

    private BigDecimal calculateTotalOrderPrice(Long orderId, Long accountId) {
        List<OrderDetailsEntity> orderDetails = orderDetailsRepository
                .findByOrder_OrderIdAndOrder_Owner_AccountId(orderId, accountId);

        return orderDetails.stream()
                .map(od -> od.getUnitPrice().multiply(BigDecimal.valueOf(od.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


}
