package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

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

    @Column(name = "order_code", updatable = false, nullable = false, length = 25)
    private String orderCode;

    private static final AtomicInteger counter = new AtomicInteger(0);

    @PrePersist
    public void prePersist() {
        if (this.orderCode == null) {
            // 1. Lấy thời gian hiện tại dạng yyyyMMddHHmmss
            String timePart = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

            // 2. Sequence 3 chữ số để tránh trùng trong cùng 1 giây
            int sequence = counter.getAndIncrement() % 1000;

            // 3. Ghép lại: yyyyMMddHHmmssXXX
            this.orderCode = String.format("%s%03d", timePart, sequence);
        }
    }

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
    @JoinColumn(name = "shipping_address", referencedColumnName = "address_id")
    private ShippingAddressEntity shippingAddress;

    @ManyToOne
    @JoinColumn(name = "process_by", referencedColumnName = "account_id")
    private AccountEntity processBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    @Column(name = "payment_status") // , columnDefinition = "BIT DEFAULT 0", nullable = false)
    private Boolean paymentStatus;
}
