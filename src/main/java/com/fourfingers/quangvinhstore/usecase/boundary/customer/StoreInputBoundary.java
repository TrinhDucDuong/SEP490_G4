package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;

public interface StoreInputBoundary {
    ListStoreOutputData findAll();
    StoreOutputData findById(String storeId);
}
