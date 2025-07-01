package com.fourfingers.quangvinhstore.usecase.boundary;


import com.fourfingers.quangvinhstore.usecase.data.customer.CartInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCartDetailsOutputData;

public interface CartInputBoundary {
    ListCartDetailsOutputData getCart(Long accountId);

    ListCartDetailsOutputData addToCart(CartInputData cartInputData);

    ListCartDetailsOutputData removeFromCart(CartInputData cartInputData);
}
