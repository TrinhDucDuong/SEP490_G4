package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table (name = "blogs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BlogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blog_id")
    private Long blogId;

    @Column(name = "blog_title", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String blogTitle;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

    @Column(name = "blog_content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1")
    private Boolean isActive;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            joinColumns = @JoinColumn(
                    name = "blog_id", referencedColumnName = "blog_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "product_id", referencedColumnName = "product_id"
            ),
            name = "blogs_products_mapping"
    )
    private List<ProductEntity> relatedProducts;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            joinColumns = @JoinColumn(
                    name = "blog_id", referencedColumnName = "blog_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "tag_name", referencedColumnName = "tag_name"
            )
            ,name = "blogs_tags_mapping"
    )
    private List<BlogTagEntity> blogTags;
}
