package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.PurchaseInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    private final OrderDetailsRepository orderDetailsRepository;
    private final AccountRepository accountRepository;

    @Override
    public ListOrderOutputData getOrders(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        return customerOrderOutputBoundary.convertToListCustomerOrderOutputData(
                orderRepository.findAllByOwnerAccountId(accountEntity.getAccountId())
                        .stream()
//                        .map(orderEntity -> {
//                            orderEntity.getOrderDetails().size();
//                            return orderMapper.toModel(orderEntity);
//                        })
                        .map(orderMapper::toModel)
                        .toList()
        );
    }

    @Override
    public OrderOutputData placeOrders(UserDetails userDetails, Long shippingAddressId) throws RuntimeException {
        AccountEntity accountEntity = (AccountEntity) userDetails;

//        ShippingAddressEntity shippingAddressEntity = null;
//        if (shippingAddressInputData.getShippingAddressId() == null) {
//            shippingAddressUseCaseInteraction.saveNewShippingAddress(accountEntity, shippingAddressInputData);
//            List<ShippingAddressEntity> shippingAddressEntities = shippingAddressRepository.findAllByAccount_AccountId(accountEntity.getAccountId());
//            shippingAddressEntity = shippingAddressEntities.get(shippingAddressEntities.size() - 1);
//        } else {
//            Optional<ShippingAddressEntity> existingEntityOpt = shippingAddressRepository
//                    .findByAccount_AccountIdAndShippingAddressId(
//                            accountEntity.getAccountId(),
//                            shippingAddressInputData.getShippingAddressId()
//                    );
//            if (existingEntityOpt.isPresent()) {
//                shippingAddressEntity = existingEntityOpt.get();
//            }
//        }
        Optional<ShippingAddressEntity> shippingAddressEntity = shippingAddressRepository
                                                                .findByAccount_AccountIdAndShippingAddressId(
                                                                        accountEntity.getAccountId(),
                                                                        shippingAddressId
                                                                );
        if (shippingAddressId == null || shippingAddressEntity.isEmpty()) {
            throw new RuntimeException("Shipping address not found");
        }
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderDate(LocalDateTime.now());
        orderEntity.setOwner(accountEntity);
        orderEntity.setShippingAddress(shippingAddressEntity.get());
        orderEntity.setOrderStatus(OrderStatus.PROCESSING);

        List<CartDetailsEntity> cartDetailsEntities = cartDetailsRepository.findByAccount_AccountId(accountEntity.getAccountId());
        List<OrderDetailsEntity> orderDetailsEntities = mapCartDetailsEntityToOrderDetailsEntity(cartDetailsEntities, orderEntity);
        orderEntity.setOrderDetails(orderDetailsEntities);

        BigDecimal totalOrderPrice = calculateTotalOrderPrice(orderEntity.getOrderId());
        orderEntity.setTotalPrice(totalOrderPrice);

        accountRepository.findById(accountEntity.getAccountId())
                                                .ifPresent(account -> {
                                                    account.setCarts(null);
                                                    accountRepository.save(account);
                                                });
        OrderEntity placedOrder = orderRepository.save(orderEntity);
        cartDetailsRepository.deleteByAccount_AccountId(accountEntity.getAccountId());

        return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(placedOrder));
    }

    @Override
    public OrderOutputData placeOrderPayLater(UserDetails userDetails, PurchaseInputData purchaseInputData) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<OrderEntity> orderEntity = orderRepository.findByOrderIdAndOwnerAccountId(purchaseInputData.getOrderId(),
                                                                                            accountEntity.getAccountId());
        if (orderEntity.isPresent()) {
//            orderEntity.get().setOrderStatus(OrderStatus.PROCESSING);
            orderEntity.get().setPaymentStatus(false);
            orderEntity.get().setOrderDate(LocalDateTime.now());
            orderEntity.get().setTotalPrice(calculateTotalOrderPrice(orderEntity.get().getOrderId()));
            OrderEntity placedOrder = orderRepository.save(orderEntity.get());
            return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(placedOrder));
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    @Override
    public OrderOutputData placeOrderPayInAdvance(UserDetails userDetails, PurchaseInputData purchaseInputData) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<OrderEntity> orderEntity = orderRepository.findByOrderIdAndOwnerAccountId(purchaseInputData.getOrderId(),
                                                                                            accountEntity.getAccountId());
        if (orderEntity.isPresent()) {
            orderEntity.get().setOrderStatus(OrderStatus.PROCESSING);
            orderEntity.get().setPaymentStatus(true);
            orderEntity.get().setOrderDate(LocalDateTime.now());
            orderEntity.get().setTotalPrice(calculateTotalOrderPrice(orderEntity.get().getOrderId()));
            OrderEntity placedOrder = orderRepository.save(orderEntity.get());
            return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(placedOrder));
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    @Override
    public OrderOutputData getOrder(Long orderId, UserDetails userDetails) throws RuntimeException {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<OrderEntity> orderEntity = orderRepository.findByOrderIdAndOwnerAccountId(orderId, accountEntity.getAccountId());
        if (orderEntity.isPresent()) {
            return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(orderEntity.get()));
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    @Override
    public OrderOutputData verifyAndPlaceOrderPayInAdvance(Map<String, String> map) {
        String vnp_SecureHash = map.get("vnp_SecureHash");
        String vnp_ResponseCode = map.get("vnp_ResponseCode");
        String vnp_TransactionStatus = map.get("vnp_TransactionStatus");
        OrderEntity orderResponse = null;
        if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            Optional<OrderEntity> orderEntity = orderRepository.findBySecureHash(vnp_SecureHash);
            if(orderEntity.isPresent()) {
                OrderEntity order = orderEntity.get();
//                order.setOrderStatus(OrderStatus.PROCESSING);
                order.setPaymentStatus(true);
                orderEntity.get().setOrderDate(LocalDateTime.now());
                orderEntity.get().setTotalPrice(calculateTotalOrderPrice(orderEntity.get().getOrderId()));
                StringBuilder allTransactionInfo = new StringBuilder();
                for (Map.Entry<String, String> entry : map.entrySet()) {
                    allTransactionInfo.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
                }
                allTransactionInfo.deleteCharAt(allTransactionInfo.length() - 1);
                order.setSecureHash(allTransactionInfo.toString());
                orderResponse = orderRepository.save(order);
            }
            if(orderResponse != null) {
                return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(orderResponse));
            }
        }
        throw new RuntimeException("Order not found");
    }

    @Override
    public void setSecureHash(Long orderId, String secureHash) {
        Optional<OrderEntity> orderEntity = orderRepository.findById(orderId);
        orderEntity.ifPresent(order -> order.setSecureHash(secureHash));
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

    private BigDecimal calculateTotalOrderPrice(Long orderId) {
        Optional<OrderDetailsEntity> orderDetails = orderDetailsRepository
                .findById(orderId);
        if (orderDetails.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return orderDetails.get().getUnitPrice().multiply(BigDecimal.valueOf(orderDetails.get().getQuantity().longValue()));

//        return orderDetails.stream()
//                .map(od -> od.getUnitPrice().multiply(BigDecimal.valueOf(od.getQuantity())))
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
