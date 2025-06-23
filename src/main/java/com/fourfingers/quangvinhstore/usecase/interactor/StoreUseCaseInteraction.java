package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.adapter.exception.StoreNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoreMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.StoreInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.StoreOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StoreUseCaseInteraction implements StoreInputBoundary {
    private final StoreRepository storeRepository;
    private final StoreOutputBoundary storeOutputBoundary;
    private final StoreMapper storeMapper;
    @Override
    public ListStoreOutputData findAll() {
        return storeOutputBoundary.convertToListStoreOutputData(
                List.of(storeRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(storeMapper::toStore)
                        .toArray(Store[]::new))
        );
    }

    @Override
    public StoreOutputData findById(String storeId) {
        try {
            Long storeUuid = Long.parseLong(storeId);
            StoreEntity storeEntity = storeRepository.findById(storeUuid).orElse(null);
            if (storeEntity != null) {
                return storeOutputBoundary.convertToStoreOutputData(
                        storeMapper.toStore(storeEntity)
                );
            } else {
                throw new StoreNotFoundException("Store not found");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid store id");
        }
    }
}
