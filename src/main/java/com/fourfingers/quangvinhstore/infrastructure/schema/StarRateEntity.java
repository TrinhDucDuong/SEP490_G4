package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

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
    @JoinColumn(name = "product_id" , nullable = false)
    private ProductEntity product;

    @ManyToOne
    @JoinColumn(name = "account_id" , nullable = false)
    private AccountEntity account;

    @Column(name = "star_rate" , nullable = false, columnDefinition = "TINYINT CHECK (star_rate BETWEEN 1 AND 5)")
    private Long starRate;
}
