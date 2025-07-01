package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.CartDetails;
import com.fourfingers.quangvinhstore.usecase.boundary.CartOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCartDetailsOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartPresenter implements CartOutputBoundary {
    @Override
    public ListCartDetailsOutputData convertToListCartDetailsOutputData(List<CartDetails> cartDetails) {
        return new ListCartDetailsOutputData(cartDetails);
    }
}
