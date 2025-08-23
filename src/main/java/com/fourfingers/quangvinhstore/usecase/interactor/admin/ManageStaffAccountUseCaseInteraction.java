package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProfileRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountOutputData;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStaffAccountUseCaseInteraction implements StaffAccountManagementInputBoundary {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final StaffAccountManagementOutputBoundary staffAccountManagementOutputBoundary;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityRepository authorityRepository;
    private final StoreRepository storeRepository;

    @Override
    public ListStaffAccountOutputData search(int pageNumber, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNumber);
        List<StaffAccount> staffAccounts = getResult(
                accountRepository.getStaffAccountWithCondition(pageable, null).getContent()
        );
        return staffAccountManagementOutputBoundary.convertToListStaffAccountOutputData(staffAccounts);
    }

    @Override
    public StaffAccountOutputData create(StaffAccountInputData staffAccountInputData, UserDetails userDetails) {
        if (!checkExistingPhoneNumber(staffAccountInputData.getPhoneNumber()) &&
            !checkExistingUsername(staffAccountInputData.getUsername())) {
            AccountEntity needToCreateAccountEntity = new AccountEntity();
            needToCreateAccountEntity.setUsername(staffAccountInputData.getUsername());
            needToCreateAccountEntity.setPassword(passwordEncoder.encode(staffAccountInputData.getPassword()));
            needToCreateAccountEntity.setActive(true);
            needToCreateAccountEntity.setCreatedAt(LocalDateTime.now());
            needToCreateAccountEntity.setCreatedBy((AccountEntity) userDetails);

            //Get and set authority
            AuthorityEntity authorityEntity = authorityRepository.findByAuthorityName("STAFF").orElseThrow(
                    () -> new RuntimeException("Authority not found")
            );
            needToCreateAccountEntity.setAuthorities(List.of(authorityEntity));

            //Get and set a Working Store
            Long storeId = Long.parseLong(staffAccountInputData.getWorkingAtStoreId());
            StoreEntity workingAt = storeRepository.findById(storeId).orElseThrow(
                    () -> new EntityNotFoundException("Store not found")
            );
            needToCreateAccountEntity.setWorkingAt(workingAt);

            AccountEntity savedAccount = accountRepository.save(needToCreateAccountEntity);

            ProfileEntity needToCreateProfileEntity = ProfileEntity.builder()
                    .account(savedAccount)
                    .firstName(staffAccountInputData.getFirstName())
                    .lastName(staffAccountInputData.getLastName())
                    .phoneNumber(staffAccountInputData.getPhoneNumber())
                    .createdAt(LocalDateTime.now())
                    .build();
            ProfileEntity savedProfileEntity = profileRepository.save(needToCreateProfileEntity);
            Pageable pageable = Pageable.ofSize(1).withPage(0);
            List<StaffAccount> staffAccounts = getResult(
                    accountRepository.getStaffAccountWithCondition(pageable, savedAccount.getAccountId()).getContent()
            );
            if (!staffAccounts.isEmpty()) {
                return staffAccountManagementOutputBoundary.convertToStaffAccountOutputData(staffAccounts.getFirst());
            } else {
                throw new EntityNotFoundException("Staff account not found");
            }
        } else {
            throw new RuntimeException("Username or phone number is already in use");
        }
    }

    @Override
    @Transactional
    public StaffAccountDetailsOutputData getById(String id) {
        Long accountId = Long.parseLong(id);
        Pageable pageable = Pageable.ofSize(1).withPage(0);
        StaffAccount staffAccount = getResult(
                accountRepository.getStaffAccountWithCondition(pageable, accountId).getContent()
        ).getFirst();
        if (staffAccount != null) {
            AccountEntity staffAccountEntity = accountRepository.findById(accountId).orElseThrow(
                    () -> new EntityNotFoundException("Staff account not found")
            );
            return staffAccountManagementOutputBoundary.convertToStaffAccountDetailsOutputData(
                    staffAccount.getAccountId(), staffAccount.getStaffName(),
                    staffAccount.getTotalProcessedOrder(), staffAccount.getTotalRevenue(),
                    staffAccountEntity.getWorkingAt().getStoreName(), staffAccountEntity.getProfile().getPhoneNumber(),
                    staffAccountEntity.getUsername()
            );
        } else {
            throw new EntityNotFoundException("Staff account not found");
        }
    }

    @Override
    public void delete(String id, UserDetails userDetails) {
        AccountEntity accountEntity = accountRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("Staff account not found")
        );
        accountEntity.setActive(false);
        accountEntity.setUpdatedBy((AccountEntity) userDetails);
        accountEntity.setUpdatedAt(LocalDateTime.now());

        accountRepository.save(accountEntity);
    }

    @Override
    public void unDelete(String id, UserDetails userDetails) {
        AccountEntity accountEntity = accountRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("Staff account not found")
        );
        accountEntity.setActive(true);
        accountEntity.setUpdatedBy((AccountEntity) userDetails);
        accountEntity.setUpdatedAt(LocalDateTime.now());

        accountRepository.save(accountEntity);
    }

    private List<StaffAccount> getResult(List<Object[]> result) {
        return result.stream()
                .map(row -> {
                    Long accountId = ((Number) row[0]).longValue();
                    String staffName = (String) row[1];
                    Long totalProcessedOrder = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                    Long totalRevenue = row[3] != null ? ((Number) row[3]).longValue() : 0L;

                    Account createdBy = null;
                    if (row[4] != null) {
                        Long createdById = ((Number) row[4]).longValue();
                        createdBy = accountRepository.findById(createdById)
                                .map(accountMapper::toAccount)
                                .orElse(null);
                    }

                    LocalDateTime createdAt = row[5] != null ? ((Timestamp) row[5]).toLocalDateTime() : null;
                    LocalDateTime updatedAt = row[7] != null ? ((Timestamp) row[7]).toLocalDateTime() : null;

                    Account updatedBy = null;
                    if (row[6] != null) {
                        Long updatedById = ((Number) row[6]).longValue();
                        updatedBy = accountRepository.findById(updatedById)
                                .map(accountMapper::toAccount)
                                .orElse(null);
                    }


                    return StaffAccount.builder()
                            .accountId(accountId)
                            .staffName(staffName)
                            .totalProcessedOrder(totalProcessedOrder)
                            .totalRevenue(totalRevenue)
                            .createdBy(createdBy)
                            .updatedBy(updatedBy)
                            .createdAt(createdAt)
                            .updatedAt(updatedAt)
                            .build();
                })
                .toList();
    }

    private boolean checkExistingUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    private boolean checkExistingPhoneNumber(String phoneNumber) {
        return profileRepository.existsByPhoneNumber(phoneNumber);
    }
}
