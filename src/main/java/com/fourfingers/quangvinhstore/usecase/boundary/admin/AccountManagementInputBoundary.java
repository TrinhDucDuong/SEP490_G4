package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.input.account.AccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.ListAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.AccountOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface AccountManagementInputBoundary {
    AccountOutputData getAccount(String id);
    ListAccountOutputData getAllAccounts();
    AccountOutputData createAccount(AccountInputData accountInputData, UserDetails userDetails);
}
