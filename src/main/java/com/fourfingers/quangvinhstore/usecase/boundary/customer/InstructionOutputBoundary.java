package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Instruction;
import com.fourfingers.quangvinhstore.usecase.data.customer.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListInstructionOutputData;

import java.util.List;

public interface InstructionOutputBoundary {
    ListInstructionOutputData convertToListInstructionOutputData(List<Instruction> instructions);
    InstructionOutputData convertToOutputData(Instruction instruction);
}
