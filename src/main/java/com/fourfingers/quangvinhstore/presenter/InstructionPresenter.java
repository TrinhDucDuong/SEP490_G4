package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Instruction;
import com.fourfingers.quangvinhstore.usecase.boundary.InstructionOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InstructionPresenter implements InstructionOutputBoundary {
    @Override
    public ListInstructionOutputData convertToListInstructionOutputData(List<Instruction> instructions) {
        return new ListInstructionOutputData(instructions);
    }
}
