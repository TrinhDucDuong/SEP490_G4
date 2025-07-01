package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.CartDetails;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCartDetailsOutputData;

import java.util.List;

public interface CartOutputBoundary {
    ListCartDetailsOutputData convertToListCartDetailsOutputData(List<CartDetails> cartDetails);
}
