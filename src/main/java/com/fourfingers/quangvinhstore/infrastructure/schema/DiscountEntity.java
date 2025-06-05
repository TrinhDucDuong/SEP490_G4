package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "discounts")
public class DiscountEntity {
    @Id
    @Column(name = "discount_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discountId;

    @Column(name = "discount_name", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String discountName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "discount_percent", precision = 3 , scale = 2)
    private BigDecimal discountPercent;

    @OneToMany(mappedBy = "discounts")
    private List<ProductEntity> products;
}
