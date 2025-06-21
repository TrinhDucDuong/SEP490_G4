package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.adapter.exception.InstructionNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.InstructionMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.InstructionOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.InstructionManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.instruction.InstructionInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageInstructionUseCaseInteraction implements InstructionManagementInputBoundary {
    private final InstructionRepository instructionRepository;
    private final InstructionOutputBoundary instructionOutputBoundary;
    private final InstructionMapper instructionMapper;
    @Override
    public ListInstructionOutputData findAll() {
        return instructionOutputBoundary.convertToListInstructionOutputData(
                List.of(instructionRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(instructionMapper::toInstruction)
                        .toArray(Instruction[]::new))
        );
    }

    @Override
    public InstructionOutputData findById(String id) {
        try {
            UUID instructionId = UUID.fromString(id);
            InstructionEntity instructionEntity = instructionRepository.findById(instructionId)
                    .orElseThrow(() -> new InstructionNotFoundException("Instruction not found"));
            return instructionOutputBoundary.convertToOutputData(instructionMapper.toInstruction(instructionEntity));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid instruction id");
        }
    }

    @Override
    public InstructionOutputData save(String id, InstructionInputData instructionInputData) {
        if(id != null) {
            try {
                UUID instructionId = UUID.fromString(id);
                InstructionEntity instructionEntity = instructionRepository.findById(instructionId)
                        .orElseThrow(() -> new InstructionNotFoundException("Instruction not found"));
                instructionEntity.setInstructionName(instructionInputData.getInstructionName());
                instructionEntity.setInstructionDescription(instructionInputData.getInstructionDescription());
                return instructionOutputBoundary.convertToOutputData(instructionMapper
                        .toInstruction(instructionRepository
                                .save(instructionEntity)));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid instruction id");
            }
        } else {
            InstructionEntity instructionEntity = InstructionEntity.builder()
                    .instructionName(instructionInputData.getInstructionName())
                    .instructionDescription(instructionInputData.getInstructionDescription())
                    .isActive(true)
                    .build();
            return instructionOutputBoundary.convertToOutputData(
                    instructionMapper.toInstruction(instructionRepository.save(instructionEntity))
            );
        }
    }

    @Override
    public InstructionOutputData delete(String id) {
        try {
            UUID instructionId = UUID.fromString(id);
            InstructionEntity instructionEntity = instructionRepository.findById(instructionId)
                    .orElseThrow(() -> new InstructionNotFoundException("Instruction not found"));
            instructionEntity.setIsActive(false);
            return instructionOutputBoundary.convertToOutputData(
                    instructionMapper.toInstruction(instructionRepository.save(instructionEntity))
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid instruction id");
        }
    }

}
