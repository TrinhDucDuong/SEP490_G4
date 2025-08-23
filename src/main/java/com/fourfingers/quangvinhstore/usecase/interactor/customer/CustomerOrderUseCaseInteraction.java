package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Order;
import com.fourfingers.quangvinhstore.domain.model.customer.OrderDetails;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.OrderMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.*;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.ListOrderOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private final ProductVariantRepository productVariantEntityRepository;
    private final ImageRepository imageRepository;
    private final ProductVariantMapper productVariantMapper;
    private final ImageMapper imageMapper;

    @Override
    @Transactional
    public ListOrderOutputData getOrders(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        return customerOrderOutputBoundary.convertToListCustomerOrderOutputData(
                orderRepository.findAllByOwnerAccountId(accountEntity.getAccountId())
                        .stream()
                        .map(this::getOrderInformation)
                        .toList()
        );
    }

    private Order getOrderInformation(OrderEntity orderEntity) {
        Order order = orderMapper.toModel(orderEntity);
        List<OrderDetails> orderDetailsList = orderEntity.getOrderDetails().stream()
                .map(orderDetailsEntity -> {
                    return OrderDetails.builder()
                            .quantity(orderDetailsEntity.getQuantity())
                            .unitPrice(orderDetailsEntity.getUnitPrice())
                            .image(getOrderDetailsImage(orderDetailsEntity))
                            .productVariant(productVariantMapper.toModel(orderDetailsEntity.getProductVariant()))
                            .build();
                })
                .toList();
        order.setOrderDetails(orderDetailsList);
        return order;
    }

    private Image getOrderDetailsImage(OrderDetailsEntity orderDetailsEntity) {
        Long productId = orderDetailsEntity.getProductVariant().getProduct().getProductId();
        return imageMapper.toModel(imageRepository.findAllByReferenceIdAndImageType(productId, ImageType.PRODUCT).get(0));
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
            if (orderEntity.get().getPaymentStatus() != null) {
                throw new RuntimeException("Order has been paid already");
            }
            if (orderEntity.get().getShippingAddress() == null) {
                throw new RuntimeException("Shipping address is had not been selected yet");
            }
            orderEntity.get().setOrderStatus(OrderStatus.PROCESSING);
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
    public OrderOutputData getOrder(Long orderId, UserDetails userDetails) throws RuntimeException {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<OrderEntity> orderEntity = orderRepository.findByOrderIdAndOwnerAccountId(orderId, accountEntity.getAccountId());
        if (orderEntity.isPresent()) {
            return customerOrderOutputBoundary.convertToCustomerOrderOutputData(getOrderInformation(orderEntity.get()));
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    @Override
    public OrderOutputData verifyAndPlaceOrderPayInAdvance(Map<String, String> map) {
        String vnp_SecureHash = map.get("vnp_SecureHash");
        String vnp_TxnRef = map.get("vnp_TxnRef");
        String vnp_ResponseCode = map.get("vnp_ResponseCode");
        String vnp_TransactionStatus = map.get("vnp_TransactionStatus");
        OrderEntity orderResponse = null;
        if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            Optional<OrderEntity> orderEntity = orderRepository.findBySecureHash(vnp_TxnRef);
            if(orderEntity.isPresent()) {
                if (orderEntity.get().getPaymentStatus() != null) {
                    throw new RuntimeException("Order has been paid already");
                }
                if (orderEntity.get().getShippingAddress() == null) {
                    throw new RuntimeException("Shipping address is had not been selected yet");
                }
                orderEntity.get().setOrderStatus(OrderStatus.PROCESSING);
                orderEntity.get().setPaymentStatus(true);
                orderEntity.get().setOrderDate(LocalDateTime.now());
                orderEntity.get().setTotalPrice(calculateTotalOrderPrice(orderEntity.get().getOrderId()));
                orderEntity.get().setSecureHash(null);
                orderResponse = orderRepository.save(orderEntity.get());
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
        orderEntity.ifPresent(order -> {
            order.setSecureHash(secureHash);
            orderRepository.save(order);
        });
    }

    @Override
    public OrderOutputData orderNow(OrderInputData orderInputData, UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<ProductVariantEntity> productVariantEntity = productVariantEntityRepository.
                                                                findByProduct_ProductIdAndColor_ColorHexAndProductSize(
                                                                        orderInputData.getProductId(),
                                                                        orderInputData.getColorHexCode(),
                                                                        ProductSize.valueOf(orderInputData.getSizeCode())
                                                                );
        if(productVariantEntity.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderDate(LocalDateTime.now());
        orderEntity.setOwner(accountEntity);
        orderEntity.setOrderStatus(null);
        orderEntity.setPaymentStatus(null);
        OrderDetailsEntity orderDetailsEntity = new OrderDetailsEntity();
        orderDetailsEntity.setOrder(orderEntity);
        orderDetailsEntity.setProductVariant(productVariantEntity.get());
        orderDetailsEntity.setQuantity(Long.valueOf(orderInputData.getQuantity()));
        orderDetailsEntity.setUnitPrice(productVariantEntity.get().getProduct().getDiscountedPrice());
        orderEntity.setTotalPrice(orderDetailsEntity.getUnitPrice().multiply(BigDecimal.valueOf(orderDetailsEntity.getQuantity())));
        orderEntity.setOrderDetails(List.of(orderDetailsEntity));
        OrderEntity placedOrder = orderRepository.save(orderEntity);
        return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(placedOrder));
    }

    @Override
    public OrderOutputData chooseShippingAddress(UserDetails userDetails, ShippingAddressIdInputData shippingAddressIdInputData, Long orderId) throws RuntimeException {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        Optional<OrderEntity> orderEntity = orderRepository.findByOrderIdAndOwnerAccountId(orderId, accountEntity.getAccountId());
        if (orderEntity.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        Optional<ShippingAddressEntity> shippingAddressEntity = shippingAddressRepository
                .findByAccount_AccountIdAndShippingAddressIdAndIsActive(
                        accountEntity.getAccountId(),
                        shippingAddressIdInputData.getShippingAddressId(),
                        true
                );
        if (shippingAddressIdInputData.getShippingAddressId() == null || shippingAddressEntity.isEmpty()) {
            throw new RuntimeException("Shipping address not found");
        }
        ShippingAddressEntity shippingAddress = shippingAddressEntity.get();
        orderEntity.get().setShippingAddress(shippingAddress);
        orderEntity.get().setTotalPrice(calculateTotalOrderPrice(orderEntity.get().getOrderId()));
        OrderEntity placedOrder = orderRepository.save(orderEntity.get());
        return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(placedOrder));
    }

    @Override
    public OrderOutputData orderByGuest(ShippingAddressInputData shippingAddressInputData, List<ProductVariantInputData> productVariantInputDataList, String paymentMethod) {
        // Shipping address
        ShippingAddressEntity shippingAddress = new ShippingAddressEntity();
        shippingAddress.setIsActive(true);
        shippingAddress.setAccount(null);
        shippingAddress.setAddress(shippingAddressInputData.getAddress());
        shippingAddress.setName(shippingAddressInputData.getName());
        shippingAddress.setPhoneNumber(shippingAddressInputData.getPhoneNumber());
        shippingAddress.setName(shippingAddressInputData.getName());
        shippingAddressInputData.setExactAddress(shippingAddressInputData.getExactAddress());
        shippingAddress = shippingAddressRepository.save(shippingAddress);

        // Order
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setShippingAddress(shippingAddress);
        orderEntity.setOrderDate(LocalDateTime.now());
        orderEntity.setOwner(null);
        orderEntity.setOrderStatus(OrderStatus.PROCESSING);
        List<OrderDetailsEntity> orderDetailsEntities = new ArrayList<>();
        for (ProductVariantInputData productVariantInputData : productVariantInputDataList) {
            Optional<ProductVariantEntity> productVariantEntity = productVariantEntityRepository
                                                                    .findByProduct_ProductIdAndColor_ColorHexAndProductSize(
                                                                            productVariantInputData.getProductId(),
                                                                            productVariantInputData.getColorHexCode(),
                                                                            ProductSize.valueOf(productVariantInputData.getSizeCode())
                                                                    );
            if (productVariantEntity.isPresent()) {
                OrderDetailsEntity orderDetailsEntity = new OrderDetailsEntity();
                orderDetailsEntity.setOrder(orderEntity);
                orderDetailsEntity.setProductVariant(productVariantEntity.get());
                orderDetailsEntity.setQuantity(Long.valueOf(productVariantInputData.getQuantity()));
                orderDetailsEntity.setUnitPrice(productVariantEntity.get().getProduct().getDiscountedPrice());
                orderDetailsEntities.add(orderDetailsEntity);
            }
        }
        orderEntity.setOrderDetails(orderDetailsEntities);
        orderEntity.setTotalPrice(calculateTotalOrderPrice(orderDetailsEntities));

        // Payment Method
        if(!paymentMethod.toUpperCase().matches("COD|VNPAY")) {
            throw new RuntimeException("Payment method not found");
        } else {
            if(paymentMethod.equalsIgnoreCase("COD")) {
                orderEntity.setPaymentStatus(false);
            }
        }
        orderEntity = orderRepository.save(orderEntity);
        return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(orderEntity));
    }

    @Override
    public OrderOutputData trackingOrder(String orderCode) {
        Optional<OrderEntity> orderEntity = orderRepository.findByOrderCode(orderCode);
        if (orderEntity.isPresent()) {
            orderEntity.get().setOwner(null);
            orderEntity.get().setShippingAddress(null);
            return customerOrderOutputBoundary.convertToCustomerOrderOutputData(orderMapper.toModel(orderEntity.get()));
        } else {
            throw new RuntimeException("Order not found");
        }
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

        for (OrderDetailsEntity orderDetail : orderDetailsList) {
            BigDecimal price = orderDetail.getProductVariant()
                    .getProduct()
                    .getDiscountedPrice();
            BigDecimal quantity = BigDecimal.valueOf(orderDetail.getQuantity());

            totalPrice = totalPrice.add(price.multiply(quantity));
        }

        return totalPrice;
    }


    private BigDecimal calculateTotalOrderPrice(List<OrderDetailsEntity> orderDetailsList) {
        if (orderDetailsList == null || orderDetailsList.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (OrderDetailsEntity orderDetail : orderDetailsList) {
            BigDecimal price = orderDetail.getProductVariant().getProduct().getDiscountedPrice();
            BigDecimal quantity = BigDecimal.valueOf(orderDetail.getQuantity());
            totalPrice = totalPrice.add(price.multiply(quantity));
        }

        return totalPrice;
    }

}