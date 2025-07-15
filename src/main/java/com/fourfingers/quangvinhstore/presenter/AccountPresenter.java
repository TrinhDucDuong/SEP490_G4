package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerAccount;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListAccountOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AccountPresenter implements AccountManagementOutputBoundary {

    @Override
    public AccountOutputData convertToAccountOutputData(CustomerAccount customerAccount) {
        return new AccountOutputData(customerAccount);
    }

    @Override
    public ListAccountOutputData convertToListAccountOutputData(List<CustomerAccount> accounts) {
        return new ListAccountOutputData(accounts);
    }
}
