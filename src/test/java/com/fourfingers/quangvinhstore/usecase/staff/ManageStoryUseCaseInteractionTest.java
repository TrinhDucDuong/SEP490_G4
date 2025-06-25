//package com.fourfingers.quangvinhstore.usecase.staff;
//
//import com.fourfingers.quangvinhstore.adapter.exception.StoryNotFoundException;
//import com.fourfingers.quangvinhstore.domain.model.customer.Story;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.StoryMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.StoryRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoryOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.input.story.StoryInputData;
//import com.fourfingers.quangvinhstore.usecase.data.output.story.ListStoryOutputData;
//import com.fourfingers.quangvinhstore.usecase.data.output.story.StoryOutputData;
//
//import com.fourfingers.quangvinhstore.usecase.interactor.staff.ManageStoryUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class ManageStoryUseCaseInteractionTest {
//
//    @Mock
//    private StoryRepository storyRepository;
//
//    @Mock
//    private StoryOutputBoundary storyOutputBoundary;
//
//    @Mock
//    private StoryMapper storyMapper;
//
//    @InjectMocks
//    private ManageStoryUseCaseInteraction manageStoryUseCaseInteraction;
//
//    @BeforeEach
//    void setup() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void getAllStory_shouldReturnList() {
//        StoryEntity entity = new StoryEntity();
//        Story model = new Story();
//        ListStoryOutputData outputData = mock(ListStoryOutputData.class);
//
//        when(storyRepository.findAllByIsActiveTrue()).thenReturn(List.of(entity));
//        when(storyMapper.toStory(entity)).thenReturn(model);
//        when(storyOutputBoundary.convertToListStoryOutputData(anyList())).thenReturn(outputData);
//
//        ListStoryOutputData result = manageStoryUseCaseInteraction.getAllStory();
//
//        assertEquals(outputData, result);
//    }
//
//    @Test
//    void getStory_validId_shouldReturnStory() {
//        String id = "1";
//        StoryEntity entity = new StoryEntity();
//        Story model = new Story();
//        StoryOutputData outputData = mock(StoryOutputData.class);
//
//        when(storyRepository.findById(1L)).thenReturn(Optional.of(entity));
//        when(storyMapper.toStory(entity)).thenReturn(model);
//        when(storyOutputBoundary.convertToStoryOutputData(model)).thenReturn(outputData);
//
//        StoryOutputData result = manageStoryUseCaseInteraction.getStory(id);
//
//        assertEquals(outputData, result);
//    }
//
//    @Test
//    void getStory_invalidId_shouldThrowRuntime() {
//        assertThrows(RuntimeException.class, () -> manageStoryUseCaseInteraction.getStory("abc"));
//    }
//
//    @Test
//    void deleteStory_validId_shouldReturnDeletedStory() {
//        String id = "1";
//        StoryEntity entity = StoryEntity.builder().isActive(true).build();
//        Story model = new Story();
//        StoryOutputData outputData = mock(StoryOutputData.class);
//
//        when(storyRepository.findByStoryIdAndIsActiveTrue(1L)).thenReturn(Optional.of(entity));
//        when(storyRepository.save(entity)).thenReturn(entity);
//        when(storyMapper.toStory(entity)).thenReturn(model);
//        when(storyOutputBoundary.convertToStoryOutputData(model)).thenReturn(outputData);
//
//        StoryOutputData result = manageStoryUseCaseInteraction.deleteStory(id);
//
//        assertFalse(entity.getIsActive());
//        assertEquals(outputData, result);
//    }
//
//    @Test
//    void deleteStory_storyNotFound_shouldThrow() {
//        when(storyRepository.findByStoryIdAndIsActiveTrue(1L)).thenReturn(Optional.empty());
//        assertThrows(StoryNotFoundException.class, () -> manageStoryUseCaseInteraction.deleteStory("1"));
//    }
//
//    @Test
//    void saveStory_withId_shouldUpdateStory() {
//        String id = "1";
//        StoryInputData input = new StoryInputData("New Title", "New Content");
//        StoryEntity entity = StoryEntity.builder().title("Old").content("Old").build();
//        Story model = new Story();
//        StoryOutputData outputData = mock(StoryOutputData.class);
//
//        when(storyRepository.findByStoryIdAndIsActiveTrue(1L)).thenReturn(Optional.of(entity));
//        when(storyRepository.save(entity)).thenReturn(entity);
//        when(storyMapper.toStory(entity)).thenReturn(model);
//        when(storyOutputBoundary.convertToStoryOutputData(model)).thenReturn(outputData);
//
//        StoryOutputData result = manageStoryUseCaseInteraction.saveStory(id, input);
//
//        assertEquals("New Title", entity.getTitle());
//        assertEquals("New Content", entity.getContent());
//        assertEquals(outputData, result);
//    }
//
//    @Test
//    void saveStory_withoutId_shouldCreateStory() {
//        StoryInputData input = new StoryInputData("Title", "Content");
//        StoryEntity entity = StoryEntity.builder().title("Title").content("Content").isActive(true).build();
//        Story model = new Story();
//        StoryOutputData outputData = mock(StoryOutputData.class);
//
//        when(storyRepository.save(any())).thenReturn(entity);
//        when(storyMapper.toStory(entity)).thenReturn(model);
//        when(storyOutputBoundary.convertToStoryOutputData(model)).thenReturn(outputData);
//
//        StoryOutputData result = manageStoryUseCaseInteraction.saveStory(null, input);
//
//        assertEquals(outputData, result);
//    }
//
//    @Test
//    public void testDeleteStoryWithInvalidId() {
//        RuntimeException exception = assertThrows(RuntimeException.class, () ->
//                manageStoryUseCaseInteraction.deleteStory("abc"));
//        assertEquals("Invalid story id", exception.getMessage());
//        verify(storyRepository, never()).findById(anyLong());
//    }
//
//    @Test
//    void saveStory_shouldThrowRuntimeException_whenIdIsInvalid() {
//        // given
//        String invalidId = "abc";
//        StoryInputData inputData = new StoryInputData("Test Title", "Test Content");
//
//        // when + then
//        RuntimeException thrown = assertThrows(
//                RuntimeException.class,
//                () -> manageStoryUseCaseInteraction.saveStory(invalidId, inputData),
//                "Expected RuntimeException for invalid ID"
//        );
//
//        // then: message should match
//        assertEquals("Invalid story id", thrown.getMessage());
//    }
//
//}
//
