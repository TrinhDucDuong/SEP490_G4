package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_details",
        uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "product_variant_id"})
)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CartDetailsEntity {
    @Id
    @Column(name = "cart_details_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartDetailsId;

    @ManyToOne
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "account_id"
    )
    private AccountEntity account;

    @ManyToOne
    @JoinColumn(
            name = "product_variant_id",
            referencedColumnName = "product_variant_id"
    )
    private ProductVariantEntity productVariant;

    @Column(name = "quantity", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short quantity;

}
