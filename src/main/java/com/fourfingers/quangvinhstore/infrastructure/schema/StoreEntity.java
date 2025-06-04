package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "stores")
public class StoreEntity {
    @Id
    @Column(name = "store_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;

    @Column(name = "store_name", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String storeAddress;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workingAt")
    private List<AccountEntity> staffs;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "stores_product_variants_mapping",
            joinColumns = @JoinColumn(
                    name = "store_id",
                    referencedColumnName = "store_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "product_variant_id",
                    referencedColumnName = "product_variant_id"
            )
    )
    private List<ProductVariantEntity> productVariants;
}
