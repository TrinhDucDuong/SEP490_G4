package com.fourfingers.quangvinhstore.domain.model.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Instruction {
    private Long instructionId;
    private String instructionName;
    private String instructionDescription;
}
