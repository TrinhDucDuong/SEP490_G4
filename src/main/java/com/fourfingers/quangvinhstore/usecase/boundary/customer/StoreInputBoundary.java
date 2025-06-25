package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.StoreOutputData;

public interface StoreInputBoundary {
    ListStoreOutputData findAll();
    StoreOutputData findById(String storeId);
}
