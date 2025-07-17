package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Instruction;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.InstructionManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListInstructionOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InstructionStaffPresenter implements InstructionManagementOutputBoundary {
    @Override
    public InstructionOutputData convertToInstructionOutputData(Instruction instruction) {
        return new InstructionOutputData(instruction);
    }

    @Override
    public ListInstructionOutputData convertToListInstructionOutputData(List<Instruction> instructions) {
        return new ListInstructionOutputData(instructions);
    }
}
