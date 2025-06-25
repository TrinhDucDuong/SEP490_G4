package com.fourfingers.quangvinhstore.domain.model.staff;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Instruction {
    private Long instructionId;
    private String instructionName;
    private String instructionDescription;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
