package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoreOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.StoreOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StorePresenter implements StoreOutputBoundary {
    @Override
    public StoreOutputData convertToStoreOutputData(Store store) {
        return new StoreOutputData(store);
    }

    @Override
    public ListStoreOutputData convertToListStoreOutputData(List<Store> stores) {
        return new ListStoreOutputData(stores);
    }
}
