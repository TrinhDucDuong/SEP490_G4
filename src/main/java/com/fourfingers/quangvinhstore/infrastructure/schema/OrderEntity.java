package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderEntity {
    @Id
    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "secure_hash", unique = true)
    private String secureHash;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetailsEntity> orderDetails;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "account_id")
    private AccountEntity owner;

    @ManyToOne
    @JoinColumn(name = "shipping_address", referencedColumnName = "account_id")
    private AccountEntity processBy;

    @ManyToOne
    @JoinColumn(name = "process_by", referencedColumnName = "address_id")
    private ShippingAddressEntity shippingAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    @Column(name = "payment_status", columnDefinition = "BIT DEFAULT 0", nullable = false)
    private Boolean paymentStatus;
}
