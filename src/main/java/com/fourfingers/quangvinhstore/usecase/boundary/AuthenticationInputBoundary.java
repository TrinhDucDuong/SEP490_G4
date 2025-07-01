package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.usecase.data.admin.account.CustomerRegistedAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;

public interface AuthenticationInputBoundary {
    AuthenticationOutputData performAuthentication(AuthenticationInputData data);

    CustomerRegistedAccountOutputData performSignupAuthentication(AuthenticationInputData data);

}