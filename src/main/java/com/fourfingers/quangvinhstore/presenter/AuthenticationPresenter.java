package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationPresenter implements AuthenticationOutputBoundary {
    @Override
    public AuthenticationOutputData convertToOutputData(Account account, String token) {
        return new AuthenticationOutputData(account, token);
    }
}
