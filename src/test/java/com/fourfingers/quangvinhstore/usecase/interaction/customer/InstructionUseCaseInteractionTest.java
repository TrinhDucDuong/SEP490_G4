package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.InstructionMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.InstructionOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListInstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.InstructionUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class InstructionUseCaseInteractionTest {
    @Mock
    private InstructionRepository instructionRepository;

    @Mock
    private InstructionMapper instructionMapper;

    @Mock
    private InstructionOutputBoundary instructionOutputBoundary;

    @InjectMocks
    private InstructionUseCaseInteraction useCase;

    private List<InstructionEntity> mockEntities;
    private List<Instruction> mockModels;
    private ListInstructionOutputData mockOutput;

    @BeforeEach
    void setUp() {
        InstructionEntity entity1 = InstructionEntity.builder().instructionId(1L)
                .instructionDescription("Uống trước khi ăn").build();
        InstructionEntity entity2 = InstructionEntity.builder().instructionId(2L)
                .instructionDescription("Lắc đều trước khi dùng").build();
        mockEntities = List.of(entity1, entity2);

        Instruction model1 = Instruction.builder().instructionId(1L)
                .instructionDescription("Uống trước khi ăn").build();
        Instruction model2 = Instruction.builder().instructionId(2L)
                .instructionDescription("Lắc đều trước khi dùng").build();
        mockModels = List.of(model1, model2);

        mockOutput = new ListInstructionOutputData(mockModels);
    }

    @Test
    void testGetListInstruction_ShouldReturnListInstructionOutputData() {
        // given
        when(instructionRepository.findAllByIsActiveTrue()).thenReturn(mockEntities);
        when(instructionMapper.toInstruction(mockEntities.get(0))).thenReturn(mockModels.get(0));
        when(instructionMapper.toInstruction(mockEntities.get(1))).thenReturn(mockModels.get(1));
        when(instructionOutputBoundary.convertToListInstructionOutputData(
                argThat(array -> array.size() == 2 &&
                                 array.getFirst().equals(mockModels.getFirst()) &&
                                 array.get(1).equals(mockModels.get(1))
                )
        )).thenReturn(mockOutput);

        // when
        ListInstructionOutputData result = useCase.getListInstruction();

        // then
        assertEquals(mockOutput, result);
        verify(instructionRepository).findAllByIsActiveTrue();
        verify(instructionMapper, times(2)).toInstruction(any());
        verify(instructionOutputBoundary).convertToListInstructionOutputData(any());
    }
}
