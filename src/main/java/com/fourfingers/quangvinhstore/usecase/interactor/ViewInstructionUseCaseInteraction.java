package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.InstructionMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.InstructionInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.InstructionOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewInstructionUseCaseInteraction implements InstructionInputBoundary {
    private final InstructionMapper instructionMapper;
    private final InstructionOutputBoundary instructionOutputBoundary;
    private final InstructionRepository instructionRepository;
    @Override
    public ListInstructionOutputData getListInstruction() {
        return instructionOutputBoundary.convertToListInstructionOutputData(
                List.of(instructionRepository.findAll()
                        .stream()
                        .map(instructionMapper::toInstruction)
                        .toArray(Instruction[]::new)
                )
        );
    }
}
