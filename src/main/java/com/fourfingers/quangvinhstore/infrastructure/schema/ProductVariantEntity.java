package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductVariantEntity {
    @Id
    @Column(name = "product_variant_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productVariantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "size_code")
    private ProductSize productSize;

    @ManyToOne
    @JoinColumn(name = "color_code", referencedColumnName = "color_code")
    private ColorEntity color;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "stores_product_variants_mapping",
            inverseJoinColumns =  @JoinColumn(
                    name = "store_id",
                    referencedColumnName = "store_id"
            ),
            joinColumns = @JoinColumn(
                    name = "product_variant_id",
                    referencedColumnName = "product_variant_id"
            )
    )
    private List<StoreEntity> stores;

    @OneToMany(mappedBy = "productVariant")
    private List<OrderDetailsEntity> orderDetails;

    @OneToMany(mappedBy = "productVariant")
    private List<CartDetailsEntity> cartDetails;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private ProductEntity product;

    @OneToMany(mappedBy = "productVariant")
    private List<StarRateEntity> starRates;

    @Column(name = "quantity")
    private Long quantity;
}
