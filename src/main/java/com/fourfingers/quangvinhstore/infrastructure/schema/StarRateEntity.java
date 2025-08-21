package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "star_rates")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StarRateEntity {
    @Id
    @Column(name = "star_rate_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long starRateId;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private AccountEntity account;

    @Column(name = "star_rate", nullable = true, columnDefinition = "TINYINT CHECK (star_rate BETWEEN 1 AND 5)")
    @Min(value = 1, message = "Star rate cannot be less than 1")
    @Max(value = 5, message = "Star rate cannot be greater than 5")
    private Long starRate;

    @ManyToOne
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariantEntity productVariant;

    @Column(name = "comment", columnDefinition = "TEXT")
    @NotBlank(message = "Comment cannot be blank")
    private String comment;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to", nullable = true)
    private StarRateEntity replyTo;

    @OneToMany(mappedBy = "replyTo", fetch = FetchType.LAZY)
    private List<StarRateEntity> staffReplies;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "order_details_id", nullable = false)
    private Long orderDetailsId;


}
