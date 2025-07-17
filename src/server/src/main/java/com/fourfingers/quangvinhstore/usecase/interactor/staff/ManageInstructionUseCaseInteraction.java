package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.adapter.exception.InstructionNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.staff.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.InstructionStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.InstructionManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.InstructionManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListInstructionOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageInstructionUseCaseInteraction implements InstructionManagementInputBoundary {
    private final InstructionRepository instructionRepository;
    private final InstructionManagementOutputBoundary instructionManagementOutputBoundary;
    private final InstructionStaffMapper instructionMapper;
    @Override
    public ListInstructionOutputData findAll() {
        return instructionManagementOutputBoundary.convertToListInstructionOutputData(
                List.of(instructionRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(instructionMapper::toModel)
                        .toArray(Instruction[]::new))
        );
    }

    @Override
    public InstructionOutputData findById(String id) {
        try {
            Long instructionId = Long.parseLong(id);
            InstructionEntity instructionEntity = instructionRepository.findById(instructionId)
                    .orElseThrow(() -> new InstructionNotFoundException("Instruction not found"));
            return instructionManagementOutputBoundary.convertToInstructionOutputData(instructionMapper
                    .toModel(instructionEntity));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid instruction id");
        }
    }

    @Override
    public InstructionOutputData save(String id, InstructionInputData instructionInputData, UserDetails userDetails) {
        if(id != null) {
            try {
                Long instructionId = Long.parseLong(id);
                InstructionEntity instructionEntity = instructionRepository.findById(instructionId)
                        .orElseThrow(() -> new InstructionNotFoundException("Instruction not found"));
                instructionEntity.setInstructionName(instructionInputData.getInstructionName());
                instructionEntity.setInstructionDescription(instructionInputData.getInstructionDescription());
                instructionEntity.setUpdatedBy((AccountEntity) userDetails);
                instructionEntity.setUpdatedAt(LocalDateTime.now());
                return instructionManagementOutputBoundary.convertToInstructionOutputData(instructionMapper
                        .toModel(instructionRepository
                                .save(instructionEntity)));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid instruction id");
            }
        } else {
            InstructionEntity instructionEntity = InstructionEntity.builder()
                    .instructionName(instructionInputData.getInstructionName())
                    .instructionDescription(instructionInputData.getInstructionDescription())
                    .isActive(true)
                    .createdBy((AccountEntity) userDetails)
                    .createdAt(LocalDateTime.now())
                    .build();
            return instructionManagementOutputBoundary.convertToInstructionOutputData(
                    instructionMapper.toModel(instructionRepository.save(instructionEntity))
            );
        }
    }

    @Override
    public InstructionOutputData delete(String id, UserDetails userDetails) {
        try {
            Long instructionId = Long.parseLong(id);
            InstructionEntity instructionEntity = instructionRepository.findById(instructionId)
                    .orElseThrow(() -> new InstructionNotFoundException("Instruction not found"));
            instructionEntity.setIsActive(false);
            instructionEntity.setUpdatedBy((AccountEntity) userDetails);
            instructionEntity.setUpdatedAt(LocalDateTime.now());
            return instructionManagementOutputBoundary.convertToInstructionOutputData(
                    instructionMapper.toModel(instructionRepository.save(instructionEntity))
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid instruction id");
        }
    }

}
