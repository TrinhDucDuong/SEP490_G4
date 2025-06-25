package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Instruction;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.InstructionOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListInstructionOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InstructionPresenter implements InstructionOutputBoundary {
    @Override
    public ListInstructionOutputData convertToListInstructionOutputData(List<Instruction> instructions) {
        return new ListInstructionOutputData(instructions);
    }

    @Override
    public InstructionOutputData convertToOutputData(Instruction instruction) {
        return new InstructionOutputData(instruction);
    }
}
