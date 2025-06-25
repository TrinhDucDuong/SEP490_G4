package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;


public interface AuthenticationOutputBoundary {
    AuthenticationOutputData convertToOutputData(Account account, String token);
}
