package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "instruction_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String instructionName;

    @Column(name = "instruction_description", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String instructionDescription;
}
