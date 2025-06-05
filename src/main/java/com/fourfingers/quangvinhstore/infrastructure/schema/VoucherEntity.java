package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
public class VoucherEntity {
    @Id
    @Column(name = "voucher_code")
    private String voucherCode;

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
