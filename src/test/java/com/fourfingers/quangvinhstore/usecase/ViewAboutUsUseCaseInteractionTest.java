//package com.fourfingers.quangvinhstore.usecase;
//
//import com.fourfingers.quangvinhstore.domain.model.Store;
//import com.fourfingers.quangvinhstore.domain.model.Story;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoreMapper;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoryMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
//import com.fourfingers.quangvinhstore.infrastructure.repository.StoryRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
//import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.AboutUsOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.output.aboutus.AboutUsOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.ViewAboutUsUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.mockito.ArgumentMatchers.anyList;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//@SpringBootTest
//public class ViewAboutUsUseCaseInteractionTest {
//    @Mock
//    private AboutUsOutputBoundary aboutUsOutputBoundary;
//
//    @Mock
//    private StoreRepository storeRepository;
//
//    @Mock
//    private StoryRepository storyRepository;
//
//    @Mock
//    private StoreMapper storeMapper;
//
//    @Mock
//    private StoryMapper storyMapper;
//
//    @InjectMocks
//    private ViewAboutUsUseCaseInteraction viewAboutUsUseCaseInteraction;
//
//    private StoreEntity mockStoreEntity;
//    private Store mockStore;
//    private StoryEntity mockStoryEntity;
//    private Story mockStory;
//    private AboutUsOutputData mockOutputData;
//
//    @BeforeEach
//    void setUp() {
//        mockStoreEntity = new StoreEntity();
//        mockStore = new Store();
//
//        mockStoryEntity = new StoryEntity();
//        mockStory = new Story();
//
//        mockOutputData = new AboutUsOutputData();
//    }
//
//    @Test
//    void testShowInformation_Success() {
//        when(storeRepository.findAll()).thenReturn(List.of(mockStoreEntity));
//        when(storeMapper.toStore(mockStoreEntity)).thenReturn(mockStore);
//
//        when(storyRepository.findAll()).thenReturn(List.of(mockStoryEntity));
//        when(storyMapper.toStory(mockStoryEntity)).thenReturn(mockStory);
//
//        when(aboutUsOutputBoundary.convertToOutputData(anyList(), anyList())).thenReturn(mockOutputData);
//
//
//        AboutUsOutputData result = viewAboutUsUseCaseInteraction.showInformation();
//
//        assertNotNull(result);
//        assertEquals(mockOutputData, result);
//
//        verify(storeRepository).findAll();
//        verify(storeMapper).toStore(mockStoreEntity);
//        verify(storyRepository).findAll();
//        verify(storyMapper).toStory(mockStoryEntity);
//        verify(aboutUsOutputBoundary).convertToOutputData(anyList(), anyList());
//    }
//}
