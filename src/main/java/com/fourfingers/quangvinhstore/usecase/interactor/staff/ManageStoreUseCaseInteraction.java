package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.adapter.exception.StoreNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoreMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoreManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.StoreOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.store.StoreInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoreUseCaseInteraction implements StoreManagementInputBoundary {
    private final StoreRepository storeRepository;
    private final StoreOutputBoundary storeOutputBoundary;
    private final StoreMapper storeMapper;
    @Override
    public ListStoreOutputData getListStore() {
        return storeOutputBoundary.convertToListStoreOutputData(
                List.of(storeRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(storeMapper::toStore)
                        .toArray(Store[]::new))
        );
    }

    @Override
    public StoreOutputData getStore(String storeId) {
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

    @Override
    public StoreOutputData save(String storeId, StoreInputData manageStoreInputData) {
        if(storeId != null) {
            try {
                Long storeUuid = Long.parseLong(storeId);
                StoreEntity storeEntity = storeRepository.findById(storeUuid)
                        .orElseThrow(() -> new StoreNotFoundException("Store not found"));
                storeEntity.setStoreName(manageStoreInputData.getStoreName());
                storeEntity.setStoreAddress(manageStoreInputData.getStoreAddress());
                Store savedStore = storeMapper.toStore(storeRepository.save(storeEntity));
                return storeOutputBoundary.convertToStoreOutputData(savedStore);
            } catch (IllegalArgumentException e) {
                throw new NumberFormatException("Invalid store id");
            }
        } else {
            StoreEntity storeEntity = StoreEntity.builder()
                    .storeName(manageStoreInputData.getStoreName())
                    .storeAddress(manageStoreInputData.getStoreAddress())
                    .isActive(true)
                    .build();
            Store savedStore = storeMapper.toStore(storeRepository.save(storeEntity));
            return storeOutputBoundary.convertToStoreOutputData(savedStore);
        }
    }

    @Override
    public StoreOutputData delete(String storeId) {
        try {
            Long storeUuid = Long.parseLong(storeId);
            StoreEntity storeEntity = storeRepository.findById(storeUuid).orElse(null);
            if(storeEntity != null) {
                storeEntity.setIsActive(false);
                Store deletedStore = storeMapper.toStore(storeRepository.save(storeEntity));
                return storeOutputBoundary.convertToStoreOutputData(deletedStore);
            } else {
                throw new StoreNotFoundException("Store not found");
            }
        } catch (IllegalArgumentException e) {
            throw new NumberFormatException("Invalid store id");
        }
    }
}
