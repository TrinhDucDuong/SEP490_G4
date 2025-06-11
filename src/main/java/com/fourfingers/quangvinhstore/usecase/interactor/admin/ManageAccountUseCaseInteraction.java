package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.account.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.ListAccountOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageAccountUseCaseInteraction implements AccountManagementInputBoundary {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final AccountManagementOutputBoundary accountManagementOutputBoundary;

    @Override
    public AccountOutputData getAccount(String id) {
        return null;
    }

    @Override
    public ListAccountOutputData getAllAccounts() {
        return accountManagementOutputBoundary.convertToListAccountOutputData(
                accountRepository.findAll()
                        .stream()
                        .map(accountMapper::toAccount)
                        .toList()
        );
    }
}
