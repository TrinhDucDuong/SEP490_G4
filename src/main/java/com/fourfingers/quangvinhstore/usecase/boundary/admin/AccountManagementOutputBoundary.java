package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.AccountOutputData;

import java.util.List;

public interface AccountManagementOutputBoundary {
    AccountOutputData convertToAccountOutputData(Account account);
    ListAccountOutputData convertToListAccountOutputData(List<Account> accounts);
}
