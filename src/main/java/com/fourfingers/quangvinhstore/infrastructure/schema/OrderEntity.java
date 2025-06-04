package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order")
    private List<OrderDetailsEntity> orderDetails;
}
