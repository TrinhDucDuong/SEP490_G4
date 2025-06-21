package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID instructionId;

    @Column(name = "instruction_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String instructionName;

    @Column(name = "instruction_description", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String instructionDescription;

    @Column(name = "is_active", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;
}
