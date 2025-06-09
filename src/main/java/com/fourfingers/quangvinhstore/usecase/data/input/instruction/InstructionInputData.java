package com.fourfingers.quangvinhstore.usecase.data.input.instruction;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InstructionInputData {
    private String instructionName;
    private String instructionDescription;
}
