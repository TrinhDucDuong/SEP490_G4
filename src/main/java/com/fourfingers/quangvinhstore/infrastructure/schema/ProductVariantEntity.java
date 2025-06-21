package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSizeEnumEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID productVariantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "size_code")
    private ProductSizeEnumEntity productSize;

    @ManyToOne
    @JoinColumn(name = "color_code", referencedColumnName = "color_code")
    private ColorEntity color;

    @ManyToMany(mappedBy = "productVariants")
    private List<StoreEntity> stores;

    @OneToMany(mappedBy = "productVariant")
    private List<OrderDetailsEntity> orderDetails;

    @OneToMany(mappedBy = "productVariant")
    private List<CartEntity> carts;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private ProductEntity product;
}
