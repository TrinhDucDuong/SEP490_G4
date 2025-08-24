package com.fourfingers.quangvinhstore.usecase.interaction.admin;

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
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.admin.ManageStaffAccountUseCaseInteraction;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ManageStaffAccountUseCaseInteractionTest {
    @InjectMocks
    private ManageStaffAccountUseCaseInteraction useCase;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private StaffAccountManagementOutputBoundary outputBoundary;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthorityRepository authorityRepository;

    @Mock
    private StoreRepository storeRepository;

    private Object[] mockRowResult;
    private List<Object[]> mockRowsResult;
    private AccountEntity mockCreatedByAccountEntity;
    private Account mockCreatedByAccount;
    private AccountEntity mockUpdatedByAccountEntity;
    private Account mockUpdatedByAccount;
    private Page<Object[]> mockPageResult;
    private AuthorityEntity mockAuthorityEntity;
    private StoreEntity mockStoreEntity;

    @BeforeEach
    public void setUp() {
        mockRowResult = new Object[]{
                3L,                             // accountId
                "Luu Tieu Long",                   // staffName
                15L,                            // totalProcessedOrder
                500000L,                        // totalRevenue
                1L,                             // createdById
                Timestamp.valueOf("2023-01-01 10:00:00"),  // createdAt
                2L,                             // updatedById
                Timestamp.valueOf("2023-06-01 15:30:00")   // updatedAt
        };

        mockRowsResult = List.<Object[]>of(mockRowResult);

        mockPageResult = new PageImpl<>(mockRowsResult);

        mockCreatedByAccountEntity = AccountEntity.builder().accountId(1L).build();
        mockCreatedByAccount = Account.builder().accountId(1L).build();

        mockUpdatedByAccountEntity = AccountEntity.builder().accountId(2L).build();
        mockUpdatedByAccount = Account.builder().accountId(2L).build();

        mockAuthorityEntity = AuthorityEntity.builder().authorityName("STAFF").build();

        mockStoreEntity = StoreEntity.builder().storeId(1L).build();
    }

    @Test
    void testSearch_ShouldReturnExpectedData() {
        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class), isNull())).thenReturn(mockPageResult);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockCreatedByAccountEntity));
        when(accountMapper.toAccount(mockCreatedByAccountEntity)).thenReturn(mockCreatedByAccount);

        when(accountRepository.findById(2L)).thenReturn(Optional.of(mockUpdatedByAccountEntity));
        when(accountMapper.toAccount(mockUpdatedByAccountEntity)).thenReturn(mockUpdatedByAccount);

        // Mock final output conversion
        List<StaffAccount> staffAccounts = List.of(StaffAccount.builder()
                .accountId(3L)
                .staffName("Luu Tieu Long")
                .totalProcessedOrder(15L)
                .totalRevenue(500000L)
                .createdBy(mockCreatedByAccount)
                .updatedBy(mockUpdatedByAccount)
                .createdAt(LocalDateTime.of(2023, 1, 1, 10, 0))
                .updatedAt(LocalDateTime.of(2023, 6, 1, 15, 30))
                .build());

        ListStaffAccountOutputData expectedOutputData = new ListStaffAccountOutputData(staffAccounts);
        when(outputBoundary.convertToListStaffAccountOutputData(any()))
                .thenReturn(expectedOutputData);

        ListStaffAccountOutputData actualResult = useCase.search(0, 10);
        assert (actualResult.getStaffAccounts().size() == 1);
        assert (actualResult.getStaffAccounts().getFirst().getAccountId() == 3L);
        assert (actualResult.getStaffAccounts().getFirst().getStaffName().equals("Luu Tieu Long"));
        assert (actualResult.getStaffAccounts().getFirst().getTotalProcessedOrder() == 15L);
        assert (actualResult.getStaffAccounts().getFirst().getTotalRevenue() == 500000L);
        assert (actualResult.getStaffAccounts().getFirst().getCreatedBy().getAccountId() == 1L);
        assert (actualResult.getStaffAccounts().getFirst().getCreatedAt().equals(LocalDateTime.of(2023, 1, 1, 10, 0)));
        assert (actualResult.getStaffAccounts().getFirst().getUpdatedBy().getAccountId() == 2L);
        assert (actualResult.getStaffAccounts().getFirst().getUpdatedAt().equals(LocalDateTime.of(2023, 6, 1, 15, 30)));
    }

    @Test
    void testSearch_ShouldReturnEmptyListWhenNoResult() {
        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class), isNull())).thenReturn(Page.empty());
        when(outputBoundary.convertToListStaffAccountOutputData(any()))
                .thenReturn(new ListStaffAccountOutputData(new ArrayList<StaffAccount>()));
        ListStaffAccountOutputData actualResult = useCase.search(0, 10);
        assert (actualResult.getStaffAccounts().isEmpty());
    }

    @Test
    void testCreate_ShouldReturnExpectedData() {
        // Given
        StaffAccountInputData inputData = StaffAccountInputData.builder()
                .username("luulong")
                .password("password123")
                .firstName("Luu")
                .lastName("Long")
                .phoneNumber("0123456789")
                .workingAtStoreId("10")
                .build();

        when(profileRepository.existsByPhoneNumber("0123456789")).thenReturn(false);
        when(accountRepository.existsByUsername("luulong")).thenReturn(false);
        when(authorityRepository.findByAuthorityName("STAFF")).thenReturn(Optional.of(mockAuthorityEntity));
        when(storeRepository.findById(any())).thenReturn(Optional.of(mockStoreEntity));

        // Mock a save account
        AccountEntity savedAccount = AccountEntity.builder()
                .accountId(3L)
                .username("luulong")
                .build();
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(savedAccount);

        // Mock save profile
        ProfileEntity savedProfile = ProfileEntity.builder()
                .account(savedAccount)
                .firstName("Luu")
                .lastName("Long")
                .phoneNumber("0123456789")
                .build();
        when(profileRepository.save(any(ProfileEntity.class))).thenReturn(savedProfile);

        // Mock query getStaffAccountWithCondition
        Object[] row = new Object[]{
                3L, "Luu Tieu Long", 20L, 1000000L, 99L, Timestamp.valueOf("2023-01-01 10:00:00"), 99L, Timestamp.valueOf("2023-01-01 10:00:00")
        };
        List<Object[]> rows = List.<Object[]>of(row);
        Page<Object[]> mockPage = new PageImpl<>(rows);
        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class), any(Long.class))).thenReturn(mockPage);

        // Mock createdBy/updatedBy lookup
        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockCreatedByAccountEntity));
        when(accountMapper.toAccount(any())).thenReturn(mockCreatedByAccount);

        // Mock output conversion
        StaffAccount mockStaffAccount = StaffAccount.builder()
                .accountId(3L)
                .staffName("Luu Tieu Long")
                .totalProcessedOrder(20L)
                .createdBy(mockCreatedByAccount)
                .createdAt(LocalDateTime.of(2023, 1, 1, 10, 0))
                .build();

        StaffAccountOutputData expectedOutput = new StaffAccountOutputData(mockStaffAccount);
        when(outputBoundary.convertToStaffAccountOutputData(any())).thenReturn(expectedOutput);

        // When
        UserDetails userDetails = (UserDetails) mockCreatedByAccountEntity;
        StaffAccountOutputData result = useCase.create(inputData, userDetails);

        // Then
        assert result != null;
        assert result.getStaffAccount().getAccountId() == 3L;
        assert result.getStaffAccount().getStaffName().equals("Luu Tieu Long");
        assert result.getStaffAccount().getCreatedBy().getAccountId() == 1L;
    }

    @Test
    void testCreateAuthorityNotFound_ShouldThrowException() {
        StaffAccountInputData inputData = StaffAccountInputData.builder()
                .username("luulong")
                .password("password123")
                .firstName("Luu")
                .lastName("Long")
                .phoneNumber("0123456789")
                .workingAtStoreId("10")
                .build();

        when(profileRepository.existsByPhoneNumber("0123456789")).thenReturn(false);
        when(accountRepository.existsByUsername("luulong")).thenReturn(false);
        when(authorityRepository.findByAuthorityName("A")).thenReturn(Optional.empty());

        UserDetails userDetails = (UserDetails) mockCreatedByAccountEntity;

        RuntimeException ex = assertThrows(RuntimeException.class, () -> useCase.create(inputData, userDetails));

        assert ex.getMessage().equals("Authority not found");
    }

    @Test
    void testCreateStoreNotFound_ShouldThrowException() {
        StaffAccountInputData inputData = StaffAccountInputData.builder()
                .username("luulong")
                .password("password123")
                .firstName("Luu")
                .lastName("Long")
                .phoneNumber("0123456789")
                .workingAtStoreId("10")
                .build();
        when(profileRepository.existsByPhoneNumber("0123456789")).thenReturn(false);
        when(accountRepository.existsByUsername("luulong")).thenReturn(false);
        when(authorityRepository.findByAuthorityName("STAFF")).thenReturn(Optional.of(mockAuthorityEntity));
        when(storeRepository.findById(any())).thenReturn(Optional.empty());
        UserDetails userDetails = (UserDetails) mockCreatedByAccountEntity;
        RuntimeException ex = assertThrows(RuntimeException.class, () -> useCase.create(inputData, userDetails));
        assert ex.getMessage().equals("Store not found");
    }

    @Test
    void testCreateUserNameExists_ShouldThrowException() {
        StaffAccountInputData inputData = StaffAccountInputData.builder()
                .username("luulong")
                .password("password123")
                .firstName("Luu")
                .lastName("Long")
                .phoneNumber("0123456789")
                .workingAtStoreId("10")
                .build();
        when(profileRepository.existsByPhoneNumber("0123456789")).thenReturn(false);
        when(accountRepository.existsByUsername("luulong")).thenReturn(true);

        UserDetails userDetails = (UserDetails) mockCreatedByAccountEntity;
        RuntimeException ex = assertThrows(RuntimeException.class, () -> useCase.create(inputData, userDetails));
        assert ex.getMessage().equals("Username or phone number is already in use");
    }

    @Test
    void testCreatePhoneNumberExists_ShouldThrowException() {
        StaffAccountInputData inputData = StaffAccountInputData.builder()
                .username("luulong")
                .password("password123")
                .firstName("Luu")
                .lastName("Long")
                .phoneNumber("0123456789")
                .workingAtStoreId("10")
                .build();
        when(profileRepository.existsByPhoneNumber("0123456789")).thenReturn(true);
        when(accountRepository.existsByUsername("luulong")).thenReturn(false);

        UserDetails userDetails = (UserDetails) mockCreatedByAccountEntity;
        RuntimeException ex = assertThrows(RuntimeException.class, () -> useCase.create(inputData, userDetails));
        assert ex.getMessage().equals("Username or phone number is already in use");
    }

    @Test
    void testGetById_ShouldReturnExpectedData() {
        Pageable expectedPageable = Pageable.ofSize(1).withPage(0);

        when(accountRepository.getStaffAccountWithCondition(expectedPageable, 3L))
                .thenReturn(mockPageResult);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockCreatedByAccountEntity));
        when(accountMapper.toAccount(mockCreatedByAccountEntity)).thenReturn(mockCreatedByAccount);

        when(accountRepository.findById(2L)).thenReturn(Optional.of(mockUpdatedByAccountEntity));
        when(accountMapper.toAccount(mockUpdatedByAccountEntity)).thenReturn(mockUpdatedByAccount);

        StaffAccount expected = StaffAccount.builder()
                .accountId(3L)
                .staffName("Luu Tieu Long")
                .totalProcessedOrder(15L)
                .totalRevenue(500000L)
                .createdBy(mockCreatedByAccount)
                .updatedBy(mockUpdatedByAccount)
                .createdAt(LocalDateTime.of(2023, 1, 1, 10, 0))
                .updatedAt(LocalDateTime.of(2023, 6, 1, 15, 30))
                .build();

        StaffAccountOutputData expectedOutput = new StaffAccountOutputData(expected);
        when(outputBoundary.convertToStaffAccountOutputData(any())).thenReturn(expectedOutput);

        assert useCase.getById("3").getAccountId() == 3L;
    }

    @Test
    void testGetById_ShouldThrowWhenNotFound() {
        when(accountRepository.getStaffAccountWithCondition(any(), any()))
                .thenReturn(Page.empty());

        assertThrows(EntityNotFoundException.class, () -> useCase.getById("999"));
    }


    @Test
    void testDelete_ShouldSetInactiveAndUpdateBy() {
        AccountEntity existingAccount = AccountEntity.builder().accountId(5L).isActive(true).build();
        UserDetails userDetails = (UserDetails) mockUpdatedByAccountEntity;

        when(accountRepository.findById(5L)).thenReturn(Optional.of(existingAccount));
        when(accountRepository.save(any())).thenReturn(existingAccount);

        useCase.delete("5", userDetails);

        assert !existingAccount.isActive();
        assert existingAccount.getUpdatedBy() == mockUpdatedByAccountEntity;
        assert existingAccount.getUpdatedAt() != null;
    }


    @Test
    void testDelete_ShouldThrowWhenNotFound() {
        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> useCase.delete("99", mock(UserDetails.class)));
    }


    @Test
    void testUnDelete_ShouldReactivateAndUpdateBy() {
        AccountEntity existingAccount = AccountEntity.builder().accountId(6L).isActive(false).build();
        UserDetails mockUser = (UserDetails) mockUpdatedByAccountEntity;

        when(accountRepository.findById(6L)).thenReturn(Optional.of(existingAccount));
        when(accountRepository.save(any())).thenReturn(existingAccount);

        useCase.unDelete("6", mockUser);

        assert existingAccount.isActive();
        assert existingAccount.getUpdatedBy() == mockUser;
        assert existingAccount.getUpdatedAt() != null;
    }

    @Test
    void testUnDelete_ShouldThrowWhenNotFound() {
        when(accountRepository.findById(77L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> useCase.unDelete("77", mock(UserDetails.class)));
    }

    @Test
    void testSearch_ShouldHandleNullValuesGracefully() {
        Object[] nullRowResult = new Object[]{
                9L,             // accountId
                "Ghost Staff",  // staffName
                null,           // totalProcessedOrder
                null,           // totalRevenue
                null,           // createdById
                null,           // createdAt
                null,           // updatedById
                null            // updatedAt
        };

        Page<Object[]> nullPageResult = new PageImpl<>(List.<Object[]>of(nullRowResult));

        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class), isNull()))
                .thenReturn(nullPageResult);

        // No need to mock createdBy or updatedBy lookup (they will not be called)
        List<StaffAccount> expectedList = List.of(StaffAccount.builder()
                .accountId(9L)
                .staffName("Ghost Staff")
                .totalProcessedOrder(0L) // should default to 0L
                .totalRevenue(0L)        // should default to 0L
                .createdBy(null)
                .updatedBy(null)
                .createdAt(null)
                .updatedAt(null)
                .build());

        when(outputBoundary.convertToListStaffAccountOutputData(any()))
                .thenReturn(new ListStaffAccountOutputData(expectedList));

        ListStaffAccountOutputData result = useCase.search(0, 10);

        assert result.getStaffAccounts().size() == 1;
        StaffAccount ghost = result.getStaffAccounts().getFirst();

        assert ghost.getAccountId() == 9L;
        assert ghost.getStaffName().equals("Ghost Staff");
        assert ghost.getTotalProcessedOrder() == 0L;
        assert ghost.getTotalRevenue() == 0L;
        assert ghost.getCreatedBy() == null;
        assert ghost.getUpdatedBy() == null;
        assert ghost.getCreatedAt() == null;
        assert ghost.getUpdatedAt() == null;
    }
}
