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

/**
 * This class handles customer account management use cases for admin operations
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCustomerAccountUseCaseInteraction implements AccountManagementInputBoundary {
    private final AccountRepository accountRepository;
    private final AccountManagementOutputBoundary accountManagementOutputBoundary;

    /**
     * Retrieves customer account information by ID
     *
     * @param id The account ID to look up
     * @return Account information as AccountOutputData
     * @throws RuntimeException         if account ID is invalid
     * @throws AccountNotFoundException if account is not found
     * @author LongLTHE170099
     */
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

    /**
     * Retrieves all customer accounts in the system
     *
     * @return List of all customer accounts as ListAccountOutputData
     * @author LongLTHE170099
     */
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

    /**
     * Deletes a customer account by ID
     *
     * @param id          The account ID to delete
     * @param userDetails The user performing the deletion
     * @return The deleted account information
     * @author LongLTHE170099
     */
    @Override
    public AccountOutputData delete(String id, UserDetails userDetails) {
        return null;
    }

    /**
     * Maps AccountEntity to CustomerAccount domain model
     *
     * @param accountEntity The account entity to convert
     * @return Mapped CustomerAccount object
     * @author LongLTHE170099
     */
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
