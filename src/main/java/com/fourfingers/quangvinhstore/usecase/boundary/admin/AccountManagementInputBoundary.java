package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.output.account.ListAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.AccountOutputData;

public interface AccountManagementInputBoundary {
    AccountOutputData getAccount(String id);
    ListAccountOutputData getAllAccounts();
}
