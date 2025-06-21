package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID policyId;

    @Column(name = "policy_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String policyName;

    @Column(name = "policy_description", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String policyDescription;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;
}
