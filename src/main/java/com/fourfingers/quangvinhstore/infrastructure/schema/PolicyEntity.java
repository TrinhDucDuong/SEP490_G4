package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "policies")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PolicyEntity {
    @Id
    @Column(name = "policy_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long policyId;

    @Column(name = "policy_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String policyName;

    @Column(name = "policy_description", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String policyDescription;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
