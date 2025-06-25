package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreOutputData;

import java.util.List;

public interface StoreManagementOutputBoundary {
    StoreOutputData convertToStoreOutputData(Store store);
    ListStoreOutputData convertToListStoreOutputData(List<Store> stores);
}
