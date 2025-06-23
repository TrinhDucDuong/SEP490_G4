package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

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
}
