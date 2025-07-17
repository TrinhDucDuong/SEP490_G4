package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoucherEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_code")
    private Long voucherCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "max_value", precision = 19 , scale = 2)
    private BigDecimal maxValue;

    @Column(name = "min_purchase_value", precision = 19 , scale = 2)
    private BigDecimal minPurchaseValue;

    @Column(name = "discount_rate", precision = 3 , scale = 2)
    private BigDecimal discountRate;

    @ManyToOne
    private AccountEntity owner;
}
