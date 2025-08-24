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

/**
 * Implementation of staff account management use case interactions.
 * Handles CRUD operations for staff accounts including search, create, get details, delete and undelete.
 *
 * @author LongLTHE170099
 */
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

    /**
     * Searches for staff accounts with pagination.
     *
     * @param pageNumber The page number to retrieve
     * @param pageSize   The number of items per page
     * @return ListStaffAccountOutputData containing the paginated staff accounts
     * @author LongLTHE170099
     */
    @Override
    public ListStaffAccountOutputData search(int pageNumber, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNumber);
        List<StaffAccount> staffAccounts = getResult(
                accountRepository.getStaffAccountWithCondition(pageable, null).getContent()
        );
        return staffAccountManagementOutputBoundary.convertToListStaffAccountOutputData(staffAccounts);
    }

    /**
     * Creates a new staff account.
     *
     * @param staffAccountInputData The staff account data to create
     * @param userDetails           The user details of the creator
     * @return StaffAccountOutputData containing the created staff account information
     * @throws RuntimeException if username or phone number already exists
     * @author LongLTHE170099
     */
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

    /**
     * Retrieves detailed information of a staff account by ID.
     *
     * @param id The ID of the staff account to retrieve
     * @return StaffAccountDetailsOutputData containing the staff account details
     * @throws EntityNotFoundException if staff account is not found
     * @author LongLTHE170099
     */
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

    /**
     * Soft deletes a staff account by setting active status to false.
     *
     * @param id          The ID of the staff account to delete
     * @param userDetails The user details of the person performing the deletion
     * @throws EntityNotFoundException if staff account is not found
     * @author LongLTHE170099
     */
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

    /**
     * Restores a previously deleted staff account by setting active status to true.
     *
     * @param id          The ID of the staff account to restore
     * @param userDetails The user details of the person performing the restoration
     * @throws EntityNotFoundException if staff account is not found
     * @author LongLTHE170099
     */
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

    /**
     * Converts database result objects to StaffAccount domain objects.
     *
     * @param result List of Object arrays containing staff account data
     * @return List of StaffAccount objects
     * @author LongLTHE170099
     */
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

    /**
     * Checks if a username already exists in the system.
     *
     * @param username The username to check
     * @return true if username exists, false otherwise
     * @author LongLTHE170099
     */
    private boolean checkExistingUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    /**
     * Checks if a phone number already exists in the system.
     *
     * @param phoneNumber The phone number to check
     * @return true if phone number exists, false otherwise
     * @author LongLTHE170099
     */
    private boolean checkExistingPhoneNumber(String phoneNumber) {
        return profileRepository.existsByPhoneNumber(phoneNumber);
    }
}
