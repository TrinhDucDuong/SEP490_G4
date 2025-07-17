package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.adapter.exception.AccountExistException;
import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.adapter.exception.AuthorityNotFoundException;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.AccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListAccountOutputData;
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
        try {
            Long accountId = Long.parseLong(id);
            AccountEntity accountEntity = accountRepository.findById(accountId).orElseThrow(
                    () -> new AccountNotFoundException("Account not found")
            );
            return accountManagementOutputBoundary.convertToAccountOutputData(
                    accountMapper.toAccount(accountEntity)
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid account id");
        }
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
    public AccountOutputData save(String id, AccountInputData accountInputData, UserDetails userDetails) {
        try {
            Long accountId = Long.parseLong(id);
            if (checkNotUpdateEmail(accountInputData.getEmail(), accountId)
                    && checkNotUpdateUsername(accountInputData.getUsername(), accountId)) {
                List<AuthorityEntity> authorityEntities = new ArrayList<>();
                AuthorityEntity authorityEntity = authorityRepository.findByAuthorityName(
                        accountInputData.getAuthorityName()
                ).orElseThrow(() -> new AuthorityNotFoundException("Authority not found"));
                authorityEntities.add(authorityEntity);
                AccountEntity needToUpdateAccount = accountRepository.findById(accountId).orElseThrow(
                        () -> new AccountNotFoundException("Account not found")
                );
                needToUpdateAccount.setEmail(accountInputData.getEmail());
                needToUpdateAccount.setUsername(accountInputData.getUsername());
                needToUpdateAccount.setPassword(passwordEncoder.encode(accountInputData.getPassword()));
                needToUpdateAccount.setAuthorities(authorityEntities);
                needToUpdateAccount.setUpdatedAt(LocalDateTime.now());
                needToUpdateAccount.setUpdatedBy((AccountEntity) userDetails);
                return accountManagementOutputBoundary.convertToAccountOutputData(
                        accountMapper.toAccount(accountRepository.save(needToUpdateAccount))
                );
            } else {
                throw new AccountExistException("Email or Username is already in use");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid account id");
        }
    }

    @Override
    public AccountOutputData save(AccountInputData accountInputData, UserDetails userDetails) {
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

    @Override
    public AccountOutputData delete(String id, UserDetails userDetails) {
        try {
            Long accountId = Long.parseLong(id);
            AccountEntity accountEntity = accountRepository.findById(accountId).orElseThrow(
                    () -> new AccountNotFoundException("Account not found")
            );
            accountEntity.setActive(false);
            accountEntity.setUpdatedBy((AccountEntity) userDetails);
            accountEntity.setUpdatedAt(LocalDateTime.now());
            return accountManagementOutputBoundary.convertToAccountOutputData(
                    accountMapper.toAccount(accountRepository.save(accountEntity))
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid account id");
        }
    }

    private boolean checkUniqueUsername(String username) {
        return accountRepository.findByUsername(username).isEmpty();
    }

    private boolean checkUniqueEmail(String email) {
        return accountRepository.findByEmail(email).isEmpty();
    }

    /*
    * Using to check for updating account
    * Case if email existed with the same id: it shows that not updating new email for this account
    * Case if email existed with the different id: it shows that other account used this email
    * @Return: true when not updating email
    * @Return: false when other account used same email
    */
    private boolean checkNotUpdateEmail(String email, Long accountId) {
        return accountRepository.findByEmailAndAccountIdNot(email, accountId).isEmpty();
    }

    /*
     * Using to check for updating account
     * Case if username existed with the same id: it shows that not updating new username for this account
     * Case if username existed with the different id: it shows that other account used this username
     * @Return: true when not updating username
     * @Return: false when other account used same username
     */
    private boolean checkNotUpdateUsername(String username, Long accountId) {
        return accountRepository.findByUsernameAndAccountIdNot(username, accountId).isEmpty();
    }
}
