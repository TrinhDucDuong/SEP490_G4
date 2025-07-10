package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
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
    private Long starRate;

    @ManyToOne
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariantEntity productVariant;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to", nullable = true)
    private StarRateEntity replyTo;

    @OneToMany(mappedBy = "replyTo", fetch = FetchType.LAZY)
    private List<StarRateEntity> staffReplies;
}
