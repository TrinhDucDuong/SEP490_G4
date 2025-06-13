package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_details",
    uniqueConstraints = @UniqueConstraint(columnNames = {"order_id", "product_variant_id"})
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailsEntity {
    @Id
    @Column(name = "order_details_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailsId;

    @ManyToOne
    @JoinColumn(
            name = "order_id",
            referencedColumnName = "order_id"
    )
    private OrderEntity order;

    @ManyToOne
    @JoinColumn(
            name = "product_variant_id",
            referencedColumnName = "product_variant_id"
    )
    private ProductVariantEntity productVariant;

    @Column(name = "quantity", nullable = false)
    private Long quantity;

    @Column(name = "unit_price", nullable = false, precision = 19, scale = 2)
    private BigDecimal unitPrice;
}
