package com.fourfingers.quangvinhstore.usecase.data.output.instruction;

import com.fourfingers.quangvinhstore.domain.model.Instruction;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InstructionOutputData {
    private Instruction instruction;
}
