package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Instruction;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListInstructionOutputData;

import java.util.List;

public interface InstructionManagementOutputBoundary {
    InstructionOutputData convertToInstructionOutputData(Instruction instruction);
    ListInstructionOutputData convertToListInstructionOutputData(List<Instruction> instructions);
}
