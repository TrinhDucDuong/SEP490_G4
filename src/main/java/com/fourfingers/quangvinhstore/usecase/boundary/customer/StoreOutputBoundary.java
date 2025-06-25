package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;

import java.util.List;

public interface StoreOutputBoundary {
    StoreOutputData convertToStoreOutputData(Store store);
    ListStoreOutputData convertToListStoreOutputData(List<Store> stores);
}
