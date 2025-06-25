package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreOutputData;

public interface StoreManagementInputBoundary {
    ListStoreOutputData getListStore();
    StoreOutputData getStore(String storeId);
    StoreOutputData save(String storeId, StoreInputData manageStoreInputData);
    StoreOutputData delete(String storeId);
}
