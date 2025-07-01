package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.CustomerRegistedAccount;
import com.fourfingers.quangvinhstore.usecase.data.admin.account.CustomerRegistedAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;


public interface AuthenticationOutputBoundary {
    AuthenticationOutputData convertToOutputData(Account account, String token);

    CustomerRegistedAccountOutputData convertToOutputData(CustomerRegistedAccount customerRegistedAccount);
}
