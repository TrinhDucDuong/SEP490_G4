package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface StoreManagementInputBoundary {
    ListStoreOutputData getListStore();
    StoreOutputData getStore(String storeId);
    StoreOutputData save(String storeId, StoreInputData manageStoreInputData, UserDetails userDetails);
    StoreOutputData delete(String storeId, UserDetails userDetails);
}
