package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoreManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StoreStaffPresenter implements StoreManagementOutputBoundary {

    @Override
    public StoreOutputData convertToStoreOutputData(Store store) {
        return new StoreOutputData(store);
    }

    @Override
    public ListStoreOutputData convertToListStoreOutputData(List<Store> stores) {
        return new ListStoreOutputData(stores);
    }
}
