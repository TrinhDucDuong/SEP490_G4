package com.fourfingers.quangvinhstore.domain.model.customer;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.ShippingAddress;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Order {
    private Long orderId;
    private Account owner;
    private LocalDateTime orderDate;
    private List<OrderDetails> orderDetails;
    private String orderStatus;
    private BigDecimal totalPrice;
    private ShippingAddress shippingAddress;
}
