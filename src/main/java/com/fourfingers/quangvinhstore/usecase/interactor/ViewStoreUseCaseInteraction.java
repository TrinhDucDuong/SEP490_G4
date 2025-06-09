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

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewStoreUseCaseInteraction implements StoreInputBoundary {
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
            StoreEntity storeEntity = storeRepository.findById(Long.valueOf(storeId)).orElse(null);
            if (storeEntity != null) {
                return storeOutputBoundary.convertToStoreOutputData(
                        storeMapper.toStore(storeEntity)
                );
            } else {
                throw new StoreNotFoundException("Store not found");
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid store id");
        }
    }
}
