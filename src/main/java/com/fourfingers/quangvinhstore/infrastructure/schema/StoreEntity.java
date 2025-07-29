package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;

    @Column(name = "store_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String storeName;

    @Column(name = "store_address", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String storeAddress;

    @Column(name = "store_phone", nullable = false, columnDefinition = "VARCHAR(20)")
    private String storePhone;

    @Column(name = "city", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String city;

    @Column(name = "district", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String district;

    @Column(name = "start_working_at", nullable = false)
    private LocalDateTime startWorkingAt;

    @Column(name = "end_working_at", nullable = false)
    private LocalDateTime endWorkingAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

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

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @Column(name = "location_lat", nullable = false, columnDefinition = "VARCHAR(20)")
    private String locationLat;

    @Column(name = "location_lng", nullable = false, columnDefinition = "VARCHAR(20)")
    private String locationLng;
}
