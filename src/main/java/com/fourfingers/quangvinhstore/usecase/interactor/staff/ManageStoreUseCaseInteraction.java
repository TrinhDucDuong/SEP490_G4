package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.adapter.exception.StoreNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.StoreStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoreManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoreManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoreUseCaseInteraction implements StoreManagementInputBoundary {
    private final StoreRepository storeRepository;
    private final StoreManagementOutputBoundary storeManagementOutputBoundary;
    private final StoreStaffMapper storeStaffMapper;
    @Override
    public ListStoreOutputData getListStore() {
        return storeManagementOutputBoundary.convertToListStoreOutputData(
                List.of(storeRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(storeStaffMapper::toModel)
                        .toArray(Store[]::new))
        );
    }

    @Override
    public StoreOutputData getStore(String storeId) {
        try {
            Long storeUuid = Long.parseLong(storeId);
            StoreEntity storeEntity = storeRepository.findById(storeUuid).orElse(null);
            if (storeEntity != null) {
                return storeManagementOutputBoundary.convertToStoreOutputData(
                        storeStaffMapper.toModel(storeEntity)
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
                Store savedStore = storeStaffMapper.toModel(storeRepository.save(storeEntity));
                return storeManagementOutputBoundary.convertToStoreOutputData(savedStore);
            } catch (IllegalArgumentException e) {
                throw new NumberFormatException("Invalid store id");
            }
        } else {
            StoreEntity storeEntity = StoreEntity.builder()
                    .storeName(manageStoreInputData.getStoreName())
                    .storeAddress(manageStoreInputData.getStoreAddress())
                    .isActive(true)
                    .build();
            Store savedStore = storeStaffMapper.toModel(storeRepository.save(storeEntity));
            return storeManagementOutputBoundary.convertToStoreOutputData(savedStore);
        }
    }

    @Override
    public StoreOutputData delete(String storeId) {
        try {
            Long storeUuid = Long.parseLong(storeId);
            StoreEntity storeEntity = storeRepository.findById(storeUuid).orElse(null);
            if(storeEntity != null) {
                storeEntity.setIsActive(false);
                Store deletedStore = storeStaffMapper.toModel(storeRepository.save(storeEntity));
                return storeManagementOutputBoundary.convertToStoreOutputData(deletedStore);
            } else {
                throw new StoreNotFoundException("Store not found");
            }
        } catch (IllegalArgumentException e) {
            throw new NumberFormatException("Invalid store id");
        }
    }
}
