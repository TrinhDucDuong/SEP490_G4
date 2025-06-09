package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.input.instruction.InstructionInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;

public interface InstructionManagementInputBoundary {
    ListInstructionOutputData findAll();
    InstructionOutputData findById(String id);
    InstructionOutputData save(String id, InstructionInputData instructionInputData);
    InstructionOutputData delete(String id);
}
