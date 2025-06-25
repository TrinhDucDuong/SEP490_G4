package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.InstructionMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.InstructionInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.InstructionOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class InstructionUseCaseInteraction implements InstructionInputBoundary {
    private final InstructionMapper instructionMapper;
    private final InstructionOutputBoundary instructionOutputBoundary;
    private final InstructionRepository instructionRepository;
    @Override
    public ListInstructionOutputData getListInstruction() {
        return instructionOutputBoundary.convertToListInstructionOutputData(
                List.of(instructionRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(instructionMapper::toInstruction)
                        .toArray(Instruction[]::new)
                )
        );
    }
}
