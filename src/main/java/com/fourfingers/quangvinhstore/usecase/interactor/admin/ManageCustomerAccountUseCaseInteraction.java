package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.admin.CustomerAccount;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListAccountOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCustomerAccountUseCaseInteraction implements AccountManagementInputBoundary {
    private final AccountRepository accountRepository;
    private final AccountManagementOutputBoundary accountManagementOutputBoundary;

    @Override
    public AccountOutputData getAccount(String id) {
        try {
            Long accountId = Long.parseLong(id);
            AccountEntity accountEntity = accountRepository.findByAccountIdAndAuthoritiesAuthorityName(accountId,
                            "CUSTOMER")
                    .orElseThrow(
                    () -> new AccountNotFoundException("Account not found")
            );
            return accountManagementOutputBoundary.convertToAccountOutputData(
                    getCustomerInformation(accountEntity)
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid account id");
        }
    }

    @Override
    @Transactional
    public ListAccountOutputData getAllAccounts() {
        return accountManagementOutputBoundary.convertToListAccountOutputData(
                accountRepository.findAllByAuthoritiesAuthorityName("CUSTOMER")
                        .stream()
                        .map(this::getCustomerInformation)
                        .toList()
        );
    }

    @Override
    public AccountOutputData delete(String id, UserDetails userDetails) {
//        try {
//            Long accountId = Long.parseLong(id);
//            AccountEntity accountEntity = accountRepository.findById(accountId).orElseThrow(
//                    () -> new AccountNotFoundException("Account not found")
//            );
//            accountEntity.setActive(false);
//            accountEntity.setUpdatedBy((AccountEntity) userDetails);
//            accountEntity.setUpdatedAt(LocalDateTime.now());
//            return accountManagementOutputBoundary.convertToAccountOutputData(
//                    accountMapper.toAccount(accountRepository.save(accountEntity))
//            );
//        } catch (IllegalArgumentException e) {
//            throw new RuntimeException("Invalid account id");
//        }
        return null;
    }

    private CustomerAccount getCustomerInformation(AccountEntity accountEntity) {
        return CustomerAccount.builder()
                .accountId(accountEntity.getAccountId())
                .username(accountEntity.getUsername())
                .birthDate(accountEntity.getProfile().getBirthDate())
                .phoneNumber(accountEntity.getProfile().getPhoneNumber())
                .fullName(accountEntity.getProfile().getFirstName() + " " + accountEntity.getProfile().getLastName())
                .email(accountEntity.getEmail())
                .isActive(accountEntity.isActive())
                .build();
    }
}
