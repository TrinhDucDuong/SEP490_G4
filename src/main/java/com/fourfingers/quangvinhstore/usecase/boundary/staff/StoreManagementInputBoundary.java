package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.input.store.StoreInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;

public interface StoreManagementInputBoundary {
    ListStoreOutputData getListStore();
    StoreOutputData getStore(String storeId);
    StoreOutputData save(String storeId, StoreInputData manageStoreInputData);
    StoreOutputData delete(String storeId);
}
