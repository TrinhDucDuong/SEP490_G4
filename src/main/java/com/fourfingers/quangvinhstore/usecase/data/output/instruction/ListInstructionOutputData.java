package com.fourfingers.quangvinhstore.usecase.data.output.instruction;

import com.fourfingers.quangvinhstore.domain.model.Instruction;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListInstructionOutputData {
    private List<Instruction> instructions;
}
