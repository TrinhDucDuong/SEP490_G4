package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductEntity {
    @Id
    @Column(name = "product_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(name = "product_name", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String productName;

    @Column(name = "product_description", nullable = false, columnDefinition = "TEXT")
    private String productDescription;

    @Column(name = "unit_price", nullable = false, precision = 19 , scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1")
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private CategoryEntity category;

    @ManyToOne
    @JoinColumn(name = "discount_id", referencedColumnName = "discount_id")
    private DiscountEntity discounts;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductVariantEntity> productVariants;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private BrandEntity brand;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "relatedProducts")
    private List<BlogEntity> relatedBlogs;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "reference_id", insertable = false, updatable = false)
    @Where(clause = "image_type = 'PRODUCT'")
    private List<ImageEntity> images;

    public List<ImageEntity> getImages() {
        return images != null && !images.isEmpty() ? images.subList(0, 1) : null;
    }

    public BigDecimal getDiscountedPrice() {
        if (this.discounts == null)
            return this.unitPrice;
        else
            return this.unitPrice.subtract(this.unitPrice.multiply(this.discounts.getDiscountPercent()));
    }
}
