package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.adapter.exception.AccountExistException;
import com.fourfingers.quangvinhstore.adapter.exception.AuthorityNotFoundException;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.account.AccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.ListAccountOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageAccountUseCaseInteraction implements AccountManagementInputBoundary {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final AccountManagementOutputBoundary accountManagementOutputBoundary;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

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

    @Override
    public AccountOutputData createAccount(AccountInputData accountInputData, UserDetails userDetails) {
        if (checkUniqueEmail(accountInputData.getEmail()) && checkUniqueUsername(accountInputData.getUsername())) {
            List<AuthorityEntity> authorityEntities = new ArrayList<>();
            AuthorityEntity authorityEntity = authorityRepository.findByAuthorityName(
                    accountInputData.getAuthorityName()
            ).orElseThrow(() -> new AuthorityNotFoundException("Authority not found"));
            authorityEntities.add(authorityEntity);
            AccountEntity needToCreatedAccount = AccountEntity.builder()
                    .username(accountInputData.getUsername())
                    .password(passwordEncoder.encode(accountInputData.getPassword()))
                    .email(accountInputData.getEmail())
                    .createdBy((AccountEntity) userDetails)
                    .createdAt(LocalDateTime.now())
                    .authorities(authorityEntities)
                    .isActive(true)
                    .build();
            return accountManagementOutputBoundary.convertToAccountOutputData(
                    accountMapper.toAccount(accountRepository.save(needToCreatedAccount))
            );
        } else {
            throw new AccountExistException("Email or Username is already in use");
        }
    }

    private boolean checkUniqueUsername(String username) {
        return accountRepository.findByUsername(username).isEmpty();
    }

    private boolean checkUniqueEmail(String email) {
        return accountRepository.findByEmail(email).isEmpty();
    }
}
