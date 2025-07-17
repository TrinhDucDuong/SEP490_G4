package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.PurchaseInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressIdInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public OrderOutputData placeOrders(UserDetails userDetails, ShippingAddressIdInputData shippingAddressIdInputData) throws RuntimeException {
        AccountEntity accountEntity = (AccountEntity) userDetails;

        Optional<ShippingAddressEntity> shippingAddressEntity = shippingAddressRepository
                .findByAccount_AccountIdAndShippingAddressIdAndIsActive(
                        accountEntity.getAccountId(),
                        shippingAddressIdInputData.getShippingAddressId(),
                        true
                );
        if (shippingAddressIdInputData.getShippingAddressId() == null || shippingAddressEntity.isEmpty()) {
            throw new RuntimeException("Shipping address not found");
        }

        List<CartDetailsEntity> cartDetailsEntities = cartDetailsRepository.findByAccount_AccountId(accountEntity.getAccountId());
        if(cartDetailsEntities.isEmpty()) {
            throw new RuntimeException("Customer doesn't have any product in cart");
        }

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderDate(LocalDateTime.now());
        orderEntity.setOwner(accountEntity);
        orderEntity.setShippingAddress(shippingAddressEntity.get());
        orderEntity.setOrderStatus(OrderStatus.PROCESSING);
        orderEntity.setPaymentStatus(false);

        List<OrderDetailsEntity> orderDetailsEntities = mapCartDetailsEntityToOrderDetailsEntity(cartDetailsEntities, orderEntity);
        orderEntity.setOrderDetails(orderDetailsEntities);

        BigDecimal totalOrderPrice = calculateTotalOrderPrice(orderDetailsEntities);
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

//    @Override
//    public OrderOutputData placeOrderPayInAdvance(UserDetails userDetails, PurchaseInputData purchaseInputData) {
//        AccountEntity accountEntity = (AccountEntity) userDetails;
//        Optional<OrderEntity> orderEntity = orderRepository.findByOrderIdAndOwnerAccountId(purchaseInputData.getOrderId(),
//                                                                                            accountEntity.getAccountId());
//        if (orderEntity.isPresent()) {
//            orderEntity.get().setOrderStatus(OrderStatus.PROCESSING);
//            orderEntity.get().setPaymentStatus(true);
//            orderEntity.get().setOrderDate(LocalDateTime.now());
//            orderEntity.get().setTotalPrice(calculateTotalOrderPrice(orderEntity.get().getOrderId()));
//            OrderEntity placedOrder = orderRepository.save(orderEntity.get());
//            return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(placedOrder));
//        } else {
//            throw new RuntimeException("Order not found");
//        }
//    }

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
                .toList();
    }

    private BigDecimal calculateTotalOrderPrice(Long orderId) {
        List<OrderDetailsEntity> orderDetailsList = orderDetailsRepository
                .findByOrder_OrderId(orderId);
        if (orderDetailsList.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        BigDecimal totalPrice = BigDecimal.ZERO;
        orderDetailsList.forEach(orderDetail -> {
            totalPrice.add(orderDetail.getProductVariant().getProduct().getDiscountedPrice().
                    multiply(BigDecimal.valueOf(orderDetail.getQuantity())));
        });
        return totalPrice;
    }

    private BigDecimal calculateTotalOrderPrice(List<OrderDetailsEntity> orderDetailsList) {
        if (orderDetailsList == null || orderDetailsList.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        BigDecimal totalPrice = BigDecimal.ZERO;
        orderDetailsList.forEach(orderDetail -> {
            totalPrice.add(orderDetail.getProductVariant().getProduct().getDiscountedPrice().
                    multiply(BigDecimal.valueOf(orderDetail.getQuantity())));
        });
        return totalPrice;
    }

}