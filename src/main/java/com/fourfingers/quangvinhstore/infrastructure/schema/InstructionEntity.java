package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "instructions")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InstructionEntity {
    @Id
    @Column(name = "instruction_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long instructionId;

    @Column(name = "instruction_name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String instructionName;

    @Column(name = "instruction_description", columnDefinition = "TEXT", nullable = false)
    private String instructionDescription;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "account_id")
    private AccountEntity createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "account_id")
    private AccountEntity updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
