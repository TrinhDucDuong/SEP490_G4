package com.fourfingers.quangvinhstore.usecase.admin;

import com.fourfingers.quangvinhstore.adapter.exception.AccountExistException;
import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.adapter.exception.AuthorityNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Authority;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.account.AccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.AccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.account.ListAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.admin.ManageAccountUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ManageAccountUseCaseInteractionTest {
    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountManagementOutputBoundary accountManagementOutputBoundary;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthorityRepository authorityRepository;

    @InjectMocks
    private ManageAccountUseCaseInteraction manageAccountUseCaseInteraction;

    private Account mockAccount;
    private AccountEntity mockAccountEntity;
    private AuthorityEntity mockAuthorityEntity;
    private Authority mockAuthority;
    private AccountOutputData mockAccountOutputData;
    private ListAccountOutputData mockListAccountOutputData;

    @BeforeEach
    void setUp() {
        mockAccount = new Account();
        mockAccountEntity = new AccountEntity();
        mockAuthority = new Authority();
        mockAuthorityEntity = new AuthorityEntity();
        mockAccountOutputData = new AccountOutputData();
        mockListAccountOutputData = new ListAccountOutputData();
    }

    @Test
    public void testGetAccountSuccess() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccountEntity));
        when(accountMapper.toAccount(mockAccountEntity)).thenReturn(mockAccount);
        when(accountManagementOutputBoundary.convertToAccountOutputData(mockAccount)).thenReturn(mockAccountOutputData);

        AccountOutputData result = manageAccountUseCaseInteraction.getAccount("1");

        assertNotNull(result);
        assertEquals(mockAccountOutputData, result);
        verify(accountRepository).findById(1L);
        verify(accountMapper).toAccount(mockAccountEntity);
        verify(accountManagementOutputBoundary).convertToAccountOutputData(mockAccount);
    }

    @Test
    public void testGetAccountNotFound() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () ->
                manageAccountUseCaseInteraction.getAccount("1"));

        assertEquals("Account not found", exception.getMessage());
        verify(accountRepository).findById(1L);
    }

    @Test
    public void testGetAccountInvalidId() {
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                manageAccountUseCaseInteraction.getAccount("abc"));
        assertEquals("Invalid account id", exception.getMessage());

        verify(accountRepository, never()).findById(anyLong());
    }

    @Test
    public void testGetAllAccountsSuccess() {
        when(accountRepository.findAll()).thenReturn(List.of(mockAccountEntity));
        when(accountMapper.toAccount(mockAccountEntity)).thenReturn(mockAccount);
        when(accountManagementOutputBoundary.convertToListAccountOutputData(anyList()))
                .thenReturn(mockListAccountOutputData);

        ListAccountOutputData result = manageAccountUseCaseInteraction.getAllAccounts();

        assertNotNull(result);
        assertEquals(mockListAccountOutputData, result);
        verify(accountRepository).findAll();
        verify(accountMapper).toAccount(mockAccountEntity);
        verify(accountManagementOutputBoundary).convertToListAccountOutputData(anyList());
    }

    @Test
    public void testSaveUpdateSuccess() {
        AccountInputData input = new AccountInputData("newUser1", "newPass", "newEmail1@mail.com", "CUSTOMER");

        when(accountRepository.findByEmailAndAccountIdNot("newEmail@mail.com", 1L)).thenReturn(
                Optional.of(mockAccountEntity)
        );
        when(accountRepository.findByUsernameAndAccountIdNot("newUser", 1L)).thenReturn(
                Optional.of(mockAccountEntity)
        );
        when(authorityRepository.findByAuthorityName("CUSTOMER")).thenReturn(Optional.of(mockAuthorityEntity));
        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccountEntity));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedPass");
        when(accountRepository.save(any())).thenReturn(mockAccountEntity);
        when(accountMapper.toAccount(mockAccountEntity)).thenReturn(mockAccount);
        when(accountManagementOutputBoundary.convertToAccountOutputData(mockAccount)).thenReturn(mockAccountOutputData);

        AccountOutputData result = manageAccountUseCaseInteraction.save("1", input, mock(AccountEntity.class));

        assertNotNull(result);
        assertEquals(mockAccountOutputData, result);

        verify(accountRepository).findById(1L);
        verify(accountMapper).toAccount(mockAccountEntity);
        verify(accountManagementOutputBoundary).convertToAccountOutputData(mockAccount);
        verify(authorityRepository).findByAuthorityName("CUSTOMER");
        verify(accountRepository).save(any());
    }

    @Test
    public void testSaveUpdateExistsEmailShouldFail() {
        AccountInputData input = new AccountInputData("newUser", "newPass", "newEmail1@gmail.com", "CUSTOMER");

        when(accountRepository.findByEmailAndAccountIdNot("newEmail1@gmail.com", 1L)).thenReturn(
                Optional.of(mockAccountEntity)
        );

        AccountExistException exception = assertThrows(AccountExistException.class, () -> {
                manageAccountUseCaseInteraction.save("1", input, mock(AccountEntity.class));
        });
        assertEquals("Email or Username is already in use", exception.getMessage());

        verify(accountRepository)
                .findByEmailAndAccountIdNot("newEmail1@gmail.com", 1L);
    }

    @Test
    public void testSaveUpdateExistsUsernameShouldFail() {
        AccountInputData input = new AccountInputData("newUser", "newPass", "newEmail@gmail.com", "CUSTOMER");

        when(accountRepository.findByEmailAndAccountIdNot("newEmail@gmail.com", 1L)).thenReturn(
                Optional.empty()
        );
        when(accountRepository.findByUsernameAndAccountIdNot("newUser", 1L)).thenReturn(
            Optional.of(mockAccountEntity)
        );
        AccountExistException exception = assertThrows(AccountExistException.class, () -> {
            manageAccountUseCaseInteraction.save("1", input, mock(AccountEntity.class));
        });
        assertEquals("Email or Username is already in use", exception.getMessage());

        verify(accountRepository)
                .findByEmailAndAccountIdNot("newEmail@gmail.com", 1L);
        verify(accountRepository).findByUsernameAndAccountIdNot("newUser", 1L);
    }

    @Test
    public void testUpdateAccountNotFound() {
        AccountInputData input = new AccountInputData("newUser", "newPass", "newEmail@mail.com", "CUSTOMER");

        when(accountRepository.findByEmailAndAccountIdNot("newEmail@mail.com", 1L)).thenReturn(
                Optional.empty()
        );
        when(accountRepository.findByUsernameAndAccountIdNot("newUser", 1L)).thenReturn(
                Optional.empty()
        );
        when(authorityRepository.findByAuthorityName("CUSTOMER")).thenReturn(Optional.of(mockAuthorityEntity));
        when(accountRepository.findById(1L)).thenReturn(
                Optional.empty()
        );

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () -> {
            manageAccountUseCaseInteraction.save("1", input, mock(AccountEntity.class));
        });
        assertEquals("Account not found", exception.getMessage());

        verify(accountRepository).findById(1L);
        verify(accountRepository).findByUsernameAndAccountIdNot("newUser", 1L);
        verify(accountRepository).findByEmailAndAccountIdNot("newEmail@mail.com", 1L);
        verify(authorityRepository).findByAuthorityName("CUSTOMER");
        verify(accountRepository).findById(1L);
    }

    @Test
    public void testUpdateAccountInvalidId() {
        AccountInputData input = new AccountInputData("newUser", "newPass", "newEmail@mail.com", "CUSTOMER");
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            manageAccountUseCaseInteraction.save("abc", input, mock(AccountEntity.class));
        });
        assertEquals("Invalid account id", exception.getMessage());

        verify(accountRepository, never()).findById(anyLong());
    }
    @Test
    public void testDeleteAccountSuccess() {
        String accountId = "1";
        AccountEntity targetEntity = new AccountEntity();
        targetEntity.setAccountId(1L);
        targetEntity.setActive(true);

        AccountEntity updatingUser = new AccountEntity();
        updatingUser.setAccountId(2L);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(targetEntity));
        when(accountRepository.save(any(AccountEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountMapper.toAccount(any(AccountEntity.class))).thenReturn(mockAccount);
        when(accountManagementOutputBoundary.convertToAccountOutputData(mockAccount)).thenReturn(mockAccountOutputData);

        // Act
        AccountOutputData result = manageAccountUseCaseInteraction.delete(accountId, updatingUser);

        // Assert
        assertNotNull(result);
        assertEquals(mockAccountOutputData, result);
        assertFalse(targetEntity.isActive());
        assertEquals(updatingUser, targetEntity.getUpdatedBy());
        assertNotNull(targetEntity.getUpdatedAt());

        verify(accountRepository).findById(1L);
        verify(accountRepository).save(targetEntity);
        verify(accountMapper).toAccount(targetEntity);
        verify(accountManagementOutputBoundary).convertToAccountOutputData(mockAccount);
    }

    @Test
    public void testDeleteAccountInvalidId() {
        AccountEntity deletingAccountEntity = new AccountEntity();
        RuntimeException runtimeException = assertThrows(RuntimeException.class, () -> {
            manageAccountUseCaseInteraction.delete("abc", deletingAccountEntity);
        });
        assertEquals("Invalid account id", runtimeException.getMessage());
    }

    @Test
    public void testDeleteAccountNotFound() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());
        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () -> {
            manageAccountUseCaseInteraction.delete("1", mock(AccountEntity.class));
        });
        assertEquals("Account not found", exception.getMessage());
    }

    @Test
    public void testSaveNewAccountSuccess() {
        AccountInputData input = new AccountInputData("newUser", "plainPassword", "newUser@gmail.com", "ADMIN");
        AccountEntity savedAccountEntity = new AccountEntity();
        AuthorityEntity authorityEntity = new AuthorityEntity();

        // mock check unique
        when(accountRepository.findByEmail("newUser@gmail.com")).thenReturn(Optional.empty());
        when(accountRepository.findByUsername("newUser")).thenReturn(Optional.empty());

        // mock authority lookup
        when(authorityRepository.findByAuthorityName("ADMIN")).thenReturn(Optional.of(authorityEntity));

        // mock encoder
        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");

        // mock save
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(savedAccountEntity);

        // mock mapper
        when(accountMapper.toAccount(savedAccountEntity)).thenReturn(mockAccount);
        when(accountManagementOutputBoundary.convertToAccountOutputData(mockAccount)).thenReturn(mockAccountOutputData);

        UserDetails mockUser = mock(AccountEntity.class); // người tạo account

        AccountOutputData result = manageAccountUseCaseInteraction.save(input, mockUser);

        assertNotNull(result);
        assertEquals(mockAccountOutputData, result);

        verify(accountRepository).save(any(AccountEntity.class));
        verify(passwordEncoder).encode("plainPassword");
        verify(accountMapper).toAccount(savedAccountEntity);
        verify(accountManagementOutputBoundary).convertToAccountOutputData(mockAccount);
    }

    @Test
    public void testSaveNewAccountEmailAlreadyExistsShouldThrowException() {
        AccountInputData input = new AccountInputData("existingUser", "any", "existingEmail@gmail.com", "CUSTOMER");

        when(accountRepository.findByEmail("existingEmail@gmail.com")).thenReturn(Optional.of(new AccountEntity()));
        when(accountRepository.findByUsername("existingUser")).thenReturn(Optional.empty()); // chỉ cần 1 trong 2 trùng

        UserDetails mockUser = mock(AccountEntity.class);

        AccountExistException exception = assertThrows(AccountExistException.class, () -> {
            manageAccountUseCaseInteraction.save(input, mockUser);
        });

        assertEquals("Email or Username is already in use", exception.getMessage());

        verify(accountRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    public void testSaveNewAccountUserAlreadyExistsShouldThrowException() {
        AccountInputData input = new AccountInputData("existingUser", "any", "existingEmail@gmail.com", "CUSTOMER");

        when(accountRepository.findByEmail("existingEmail@gmail.com")).thenReturn(Optional.empty());
        when(accountRepository.findByUsername("existingUser")).thenReturn(Optional.of(mockAccountEntity));

        UserDetails mockUser = mock(AccountEntity.class);

        AccountExistException exception = assertThrows(AccountExistException.class, () -> {
            manageAccountUseCaseInteraction.save(input, mockUser);
        });

        assertEquals("Email or Username is already in use", exception.getMessage());

        verify(accountRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    public void testSaveNewAccount_AuthorityNotFound_ShouldThrowException() {
        AccountInputData input = new AccountInputData("user", "pass", "user@gmail.com", "MANAGER");

        // unique
        when(accountRepository.findByEmail("user@gmail.com")).thenReturn(Optional.empty());
        when(accountRepository.findByUsername("user")).thenReturn(Optional.empty());

        // authority not found
        when(authorityRepository.findByAuthorityName("MANAGER")).thenReturn(Optional.empty());

        UserDetails mockUser = mock(AccountEntity.class);

        AuthorityNotFoundException exception = assertThrows(AuthorityNotFoundException.class, () -> {
            manageAccountUseCaseInteraction.save(input, mockUser);
        });

        assertEquals("Authority not found", exception.getMessage());

        verify(accountRepository, never()).save(any());
    }

}
