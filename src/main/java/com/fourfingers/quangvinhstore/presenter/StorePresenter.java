package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.usecase.boundary.StoreOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.store.ListStoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;
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
