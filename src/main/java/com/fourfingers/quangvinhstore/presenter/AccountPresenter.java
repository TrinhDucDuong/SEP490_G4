package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.account.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.ListAccountOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AccountPresenter implements AccountManagementOutputBoundary {

    @Override
    public AccountOutputData convertToAccountOutputData(Account account) {
        return new AccountOutputData(account);
    }

    @Override
    public ListAccountOutputData convertToListAccountOutputData(List<Account> accounts) {
        return new ListAccountOutputData(accounts);
    }
}
