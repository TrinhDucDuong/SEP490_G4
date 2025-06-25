//package com.fourfingers.quangvinhstore.usecase;
//
//
//import com.fourfingers.quangvinhstore.adapter.exception.StoreNotFoundException;
//import com.fourfingers.quangvinhstore.domain.model.customer.Store;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.StoreMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoreOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
//import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.ViewStoreUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.anyList;
//import static org.mockito.Mockito.*;
//
//
//@SpringBootTest
//@ActiveProfiles("test")
//public class ViewStoreUseCaseInteractionTest {
//    @Mock
//    private StoreRepository storeRepository;
//
//    @Mock
//    private StoreOutputBoundary storeOutputBoundary;
//
//    @Mock
//    private StoreMapper storeMapper;
//
//    @InjectMocks
//    private ViewStoreUseCaseInteraction viewStoreUseCaseInteraction;
//
//    private StoreEntity mockStoreEntity;
//    private Store mockStore;
//    private StoreOutputData mockStoreOutputData;
//    private ListStoreOutputData mockListStoreOutputData;
//
//    @BeforeEach
//    void setUp() {
//        mockStoreEntity = new StoreEntity();
//        mockStore = new Store();
//        mockStoreOutputData = new StoreOutputData();
//        mockListStoreOutputData = new ListStoreOutputData(List.of(mockStore));
//    }
//
//    @Test
//    public void testFindAllSuccess() {
//        when(storeRepository.findAllByIsActiveTrue()).thenReturn(List.of(mockStoreEntity));
//        when(storeMapper.toStore(mockStoreEntity)).thenReturn(mockStore);
//        when(storeOutputBoundary.convertToListStoreOutputData(anyList())).thenReturn(mockListStoreOutputData);
//
//        ListStoreOutputData result = viewStoreUseCaseInteraction.findAll();
//
//        assertNotNull(result);
//        assertEquals(mockListStoreOutputData, result);
//        verify(storeRepository).findAllByIsActiveTrue();
//        verify(storeMapper).toStore(mockStoreEntity);
//        verify(storeOutputBoundary).convertToListStoreOutputData(anyList());
//    }
//
//    @Test
//    public void testFindByIdSuccess() {
//        when(storeRepository.findById(1L)).thenReturn(Optional.of(mockStoreEntity));
//        when(storeMapper.toStore(mockStoreEntity)).thenReturn(mockStore);
//        when(storeOutputBoundary.convertToStoreOutputData(mockStore)).thenReturn(mockStoreOutputData);
//
//        StoreOutputData result = viewStoreUseCaseInteraction.findById("1");
//
//        assertNotNull(result);
//        assertEquals(mockStoreOutputData, result);
//        verify(storeRepository).findById(1L);
//        verify(storeMapper).toStore(mockStoreEntity);
//        verify(storeOutputBoundary).convertToStoreOutputData(mockStore);
//    }
//
//    @Test
//    public void testFindByIdNotFound() {
//        when(storeRepository.findById(2L)).thenReturn(Optional.empty());
//
//        StoreNotFoundException exception = assertThrows(StoreNotFoundException.class, () ->
//                viewStoreUseCaseInteraction.findById("2"));
//
//        assertEquals("Store not found", exception.getMessage());
//        verify(storeRepository).findById(2L);
//    }
//
//    @Test
//    public void testFindByInvalidId() {
//        RuntimeException exception = assertThrows(RuntimeException.class, () ->
//                viewStoreUseCaseInteraction.findById("abc"));
//
//        assertEquals("Invalid store id", exception.getMessage());
//        verify(storeRepository, never()).findById(anyLong());
//    }
//}
