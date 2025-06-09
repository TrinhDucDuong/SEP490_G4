package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Instruction;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;

import java.util.List;

public interface InstructionOutputBoundary {
    ListInstructionOutputData convertToListInstructionOutputData(List<Instruction> instructions);
}
