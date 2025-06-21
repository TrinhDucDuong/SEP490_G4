package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stores")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreEntity {
    @Id
    @Column(name = "store_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID storeId;

    @Column(name = "store_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String storeName;

    @Column(name = "store_address", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String storeAddress;

    @Column(name = "is_active", nullable = false, columnDefinition = "BIT DEFAULT 1")
    private Boolean isActive;

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
