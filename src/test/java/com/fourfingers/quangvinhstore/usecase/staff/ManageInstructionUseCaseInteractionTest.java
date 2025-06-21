//package com.fourfingers.quangvinhstore.usecase.staff;
//
//import com.fourfingers.quangvinhstore.adapter.exception.InstructionNotFoundException;
//import com.fourfingers.quangvinhstore.domain.model.Instruction;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.InstructionMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.InstructionRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.InstructionOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.input.instruction.InstructionInputData;
//import com.fourfingers.quangvinhstore.usecase.data.output.instruction.InstructionOutputData;
//import com.fourfingers.quangvinhstore.usecase.data.output.instruction.ListInstructionOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.staff.ManageInstructionUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class ManageInstructionUseCaseInteractionTest {
//
//    @Mock
//    private InstructionRepository instructionRepository;
//
//    @Mock
//    private InstructionOutputBoundary instructionOutputBoundary;
//
//    @Mock
//    private InstructionMapper instructionMapper;
//
//    @InjectMocks
//    private ManageInstructionUseCaseInteraction interaction;
//
//    private InstructionEntity instructionEntity;
//    private Instruction instruction;
//    private InstructionOutputData instructionOutputData;
//    private ListInstructionOutputData listInstructionOutputData;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        instructionEntity = InstructionEntity.builder()
//                .instructionName("Test Name")
//                .instructionDescription("Test Desc")
//                .isActive(true)
//                .build();
//
//        instruction = new Instruction();
//        instructionOutputData = new InstructionOutputData();
//        listInstructionOutputData = new ListInstructionOutputData(List.of(instruction));
//    }
//
//    @Test
//    void testFindAllSuccess() {
//        when(instructionRepository.findAllByIsActiveTrue()).thenReturn(List.of(instructionEntity));
//        when(instructionMapper.toInstruction(instructionEntity)).thenReturn(instruction);
//        when(instructionOutputBoundary.convertToListInstructionOutputData(anyList()))
//                .thenReturn(listInstructionOutputData);
//
//        ListInstructionOutputData result = interaction.findAll();
//
//        assertNotNull(result);
//        assertEquals(listInstructionOutputData, result);
//        verify(instructionRepository).findAllByIsActiveTrue();
//        verify(instructionMapper).toInstruction(instructionEntity);
//        verify(instructionOutputBoundary).convertToListInstructionOutputData(anyList());
//    }
//
//    @Test
//    void testFindByIdSuccess() {
//        when(instructionRepository.findById(1L)).thenReturn(Optional.of(instructionEntity));
//        when(instructionMapper.toInstruction(instructionEntity)).thenReturn(instruction);
//        when(instructionOutputBoundary.convertToOutputData(instruction)).thenReturn(instructionOutputData);
//
//        InstructionOutputData result = interaction.findById("1");
//
//        assertNotNull(result);
//        assertEquals(instructionOutputData, result);
//    }
//
//    @Test
//    void testFindByIdNotFound() {
//        when(instructionRepository.findById(1L)).thenReturn(Optional.empty());
//
//        assertThrows(InstructionNotFoundException.class, () -> interaction.findById("1"));
//    }
//
//    @Test
//    void testFindByIdInvalid() {
//        assertThrows(RuntimeException.class, () -> interaction.findById("abc"));
//    }
//
//    @Test
//    void testSaveCreateSuccess() {
//        InstructionInputData input = new InstructionInputData("New Name", "New Desc");
//        InstructionEntity savedEntity = InstructionEntity.builder()
//                .instructionName("New Name")
//                .instructionDescription("New Desc")
//                .isActive(true)
//                .build();
//
//        when(instructionRepository.save(any())).thenReturn(savedEntity);
//        when(instructionMapper.toInstruction(savedEntity)).thenReturn(instruction);
//        when(instructionOutputBoundary.convertToOutputData(instruction)).thenReturn(instructionOutputData);
//
//        InstructionOutputData result = interaction.save(null, input);
//
//        assertNotNull(result);
//        verify(instructionRepository).save(any());
//    }
//
//    @Test
//    void testSaveUpdateSuccess() {
//        InstructionInputData input = new InstructionInputData("Updated Name", "Updated Desc");
//        InstructionEntity updatedEntity = InstructionEntity.builder()
//                .instructionName("Updated Name")
//                .instructionDescription("Updated Desc")
//                .isActive(true)
//                .build();
//
//        when(instructionRepository.findById(1L)).thenReturn(Optional.of(instructionEntity));
//        when(instructionRepository.save(any())).thenReturn(updatedEntity);
//        when(instructionMapper.toInstruction(updatedEntity)).thenReturn(instruction);
//        when(instructionOutputBoundary.convertToOutputData(instruction)).thenReturn(instructionOutputData);
//
//        InstructionOutputData result = interaction.save("1", input);
//
//        assertNotNull(result);
//        verify(instructionRepository).findById(1L);
//        verify(instructionRepository).save(any());
//    }
//
//    @Test
//    void testSaveUpdateNotFound() {
//        when(instructionRepository.findById(1L)).thenReturn(Optional.empty());
//        InstructionInputData input = new InstructionInputData("Name", "Desc");
//
//        assertThrows(InstructionNotFoundException.class, () -> interaction.save("1", input));
//    }
//
//    @Test
//    void testSaveUpdateInvalidId() {
//        InstructionInputData input = new InstructionInputData("Name", "Desc");
//
//        assertThrows(RuntimeException.class, () -> interaction.save("abc", input));
//    }
//
//    @Test
//    void testDeleteSuccess() {
//        when(instructionRepository.findById(1L)).thenReturn(Optional.of(instructionEntity));
//        when(instructionRepository.save(any())).thenReturn(instructionEntity);
//        when(instructionMapper.toInstruction(instructionEntity)).thenReturn(instruction);
//        when(instructionOutputBoundary.convertToOutputData(instruction)).thenReturn(instructionOutputData);
//
//        InstructionOutputData result = interaction.delete("1");
//
//        assertNotNull(result);
//        verify(instructionRepository).findById(1L);
//        verify(instructionRepository).save(instructionEntity);
//    }
//
//    @Test
//    void testDeleteNotFound() {
//        when(instructionRepository.findById(1L)).thenReturn(Optional.empty());
//
//        assertThrows(InstructionNotFoundException.class, () -> interaction.delete("1"));
//    }
//
//    @Test
//    void testDeleteInvalidId() {
//        assertThrows(RuntimeException.class, () -> interaction.delete("abc"));
//    }
//}
//
