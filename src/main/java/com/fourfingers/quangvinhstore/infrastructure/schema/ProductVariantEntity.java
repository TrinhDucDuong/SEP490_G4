package com.fourfingers.quangvinhstore.infrastructure.schema;

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

    @ManyToOne
    @JoinColumn(name = "size_code", referencedColumnName = "size_code")
    private SizeEntity size;

    @ManyToOne
    @JoinColumn(name = "color_code", referencedColumnName = "color_code")
    private ColorEntity color;

    @ManyToMany(mappedBy = "productVariants")
    private List<StoreEntity> stores;

    @OneToMany(mappedBy = "productVariant")
    private List<OrderDetailsEntity> orderDetails;
}
