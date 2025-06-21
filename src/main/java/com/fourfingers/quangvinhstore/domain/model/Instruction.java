package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Instruction {
    private String instructionId;
    private String instructionName;
    private String instructionDescription;
}
