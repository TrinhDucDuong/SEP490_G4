package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.adapter.exception.StoreNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.StoreMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoreOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.StoreOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.StoreUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StoreUseCaseInteractionTest {
    @Mock
    private StoreRepository storeRepository;

    @Mock
    private StoreOutputBoundary storeOutputBoundary;

    @Mock
    private StoreMapper storeMapper;

    @InjectMocks
    private StoreUseCaseInteraction useCase;

    private StoreEntity storeEntity;
    private Store store;
    private StoreOutputData storeOutputData;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        storeEntity = StoreEntity.builder()
                .storeId(1L)
                .storeName("Mock Store")
                .isActive(true)
                .build();

        store = Store.builder()
                .storeId(1L)
                .storeName("Mock Store")
                .build();

        storeOutputData = new StoreOutputData();
    }

    @Test
    void testFindAll_shouldReturnActiveStores() {
        when(storeRepository.findAllByIsActiveTrue()).thenReturn(List.of(storeEntity));
        when(storeMapper.toModel(storeEntity)).thenReturn(store);
        when(storeOutputBoundary.convertToListStoreOutputData(any()))
                .thenReturn(new ListStoreOutputData());

        ListStoreOutputData result = useCase.findAll();

        assertNotNull(result);
        verify(storeRepository).findAllByIsActiveTrue();
        verify(storeMapper).toModel(storeEntity);
        verify(storeOutputBoundary).convertToListStoreOutputData(any());
    }

    @Test
    void testFindById_shouldReturnStoreOutputData() {
        when(storeRepository.findById(1L)).thenReturn(Optional.of(storeEntity));
        when(storeMapper.toModel(storeEntity)).thenReturn(store);
        when(storeOutputBoundary.convertToStoreOutputData(store)).thenReturn(storeOutputData);

        StoreOutputData result = useCase.findById("1");

        assertNotNull(result);
        verify(storeRepository).findById(1L);
        verify(storeMapper).toModel(storeEntity);
        verify(storeOutputBoundary).convertToStoreOutputData(store);
    }

    @Test
    void testFindById_shouldThrowStoreNotFoundException_whenStoreNotFound() {
        when(storeRepository.findById(1L)).thenReturn(Optional.empty());

        StoreNotFoundException exception = assertThrows(StoreNotFoundException.class, () -> useCase.findById("1"));

        assertEquals("Store not found", exception.getMessage());
    }

    @Test
    void testFindById_shouldThrowRuntimeException_whenInvalidId() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> useCase.findById("not-a-number"));

        assertEquals("Invalid store id", exception.getMessage());
    }
}

