//package com.fourfingers.quangvinhstore.usecase;
//
//import com.fourfingers.quangvinhstore.domain.model.customer.Instruction;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.InstructionMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.customer.InstructionOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.ViewInstructionUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.anyList;
//import static org.mockito.Mockito.*;
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//public class ViewInstructionUseCaseInteractionTest {
//    @Mock
//    private InstructionRepository instructionRepository;
//
//    @Mock
//    private InstructionMapper instructionMapper;
//
//    @Mock
//    private InstructionOutputBoundary instructionOutputBoundary;
//
//    @InjectMocks
//    private ViewInstructionUseCaseInteraction viewInstructionUseCaseInteraction;
//
//    private Instruction mockInstruction;
//    private InstructionEntity mockInstructionEntity;
//    private ListInstructionOutputData mockOutputData;
//
//    @BeforeEach
//    void setUp() {
//        mockInstruction = new Instruction();
//        mockInstructionEntity = new InstructionEntity();
//        mockOutputData = new ListInstructionOutputData();
//    }
//
//    @Test
//    public void getListInstruction() {
//        when(instructionRepository.findAllByIsActiveTrue()).thenReturn(List.of(mockInstructionEntity));
//        when(instructionMapper.toInstruction(mockInstructionEntity)).thenReturn(mockInstruction);
//        when(instructionOutputBoundary.convertToListInstructionOutputData(anyList()))
//                .thenReturn(mockOutputData);
//
//        ListInstructionOutputData result = viewInstructionUseCaseInteraction.getListInstruction();
//        assertNotNull(result);
//        assertEquals(mockOutputData, result);
//
//        verify(instructionRepository).findAllByIsActiveTrue();
//        verify(instructionMapper).toInstruction(mockInstructionEntity);
//        verify(instructionOutputBoundary).convertToListInstructionOutputData(anyList());
//    }
//}
