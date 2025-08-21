package com.fourfingers.quangvinhstore.usecase.interaction;

import com.fourfingers.quangvinhstore.domain.model.CustomerRegistedAccount;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.CustomerRegistedAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.interactor.AuthenticationUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationUseCaseInteractionTest {

    private AccountMapper accountMapper;
    private AccountRepository accountRepository;
    private AuthenticationOutputBoundary authenticationOutputBoundary;
    private JwtUtilBoundary jwtUtil;
    private AuthorityRepository authorityRepository;
    private ProfileRepository profileRepository;
    private ImageRepository imageRepository;

    private AuthenticationUseCaseInteraction useCase;

    @BeforeEach
    void setUp() {
        accountMapper = mock(AccountMapper.class);
        accountRepository = mock(AccountRepository.class);
        authenticationOutputBoundary = mock(AuthenticationOutputBoundary.class);
        jwtUtil = mock(JwtUtilBoundary.class);
        authorityRepository = mock(AuthorityRepository.class);
        profileRepository = mock(ProfileRepository.class);
        imageRepository = mock(ImageRepository.class);

        useCase = new AuthenticationUseCaseInteraction(
                accountMapper,
                accountRepository,
                authenticationOutputBoundary,
                jwtUtil,
                authorityRepository,
                profileRepository,
                imageRepository
        );
    }

    @Test
    void testValidSignup_ShouldReturnUser() {
        AuthenticationInputData input = new AuthenticationInputData("customer123", "123456789");

        when(accountRepository.findByUsername("customer123")).thenReturn(Optional.empty());
        when(authorityRepository.findById("CUSTOMER")).thenReturn(Optional.of(new AuthorityEntity()));
        when(accountRepository.save(any(AccountEntity.class))).thenAnswer(i -> i.getArguments()[0]);
        when(profileRepository.save(any(ProfileEntity.class))).thenAnswer(i -> {
            ProfileEntity p = (ProfileEntity) i.getArguments()[0];
            p.setProfileId(1L);
            return p;
        });
        when(authenticationOutputBoundary.convertToOutputData(any(CustomerRegistedAccount.class)))
                .thenAnswer(i -> {
                    CustomerRegistedAccount acc = (CustomerRegistedAccount) i.getArguments()[0];
                    return new CustomerRegistedAccountOutputData(new CustomerRegistedAccount(acc.getUsername(), acc.getPassword()));
                });

        CustomerRegistedAccountOutputData result = useCase.performSignupAuthentication(input);

        assertNotNull(result);
        assertEquals("customer123", result.getCustomerRegistedAccount().getUsername());
    }

    // Username blank
    @Test
    void testUsernameBlank_ShouldThrowException() {
        AuthenticationInputData input = new AuthenticationInputData("", "123456789");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> useCase.performSignupAuthentication(input));
        assertEquals("Username cannot be blank", ex.getMessage());
    }

    // Username length < 10
    @Test
    void testUsernameTooShort_ShouldThrowException() {
        AuthenticationInputData input = new AuthenticationInputData("customer1", "123456789");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> useCase.performSignupAuthentication(input));
        assertEquals("Username must be between 10 and 15 characters", ex.getMessage());
    }

    // Username length = 10
    @Test
    void testUsernameLength10_ShouldPass() {
        AuthenticationInputData input = new AuthenticationInputData("customer10", "123456789");
        assertDoesNotThrow(() -> useCase.performSignupAuthentication(input));
    }

    // Username length = 15
    @Test
    void testUsernameLength15_ShouldPass() {
        AuthenticationInputData input = new AuthenticationInputData("customerUser001", "123456789");
        assertDoesNotThrow(() -> useCase.performSignupAuthentication(input));
    }

    // Username length > 15
    @Test
    void testUsernameTooLong_ShouldThrowException() {
        AuthenticationInputData input = new AuthenticationInputData("customerUser0001", "123456789");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> useCase.performSignupAuthentication(input));
        assertEquals("Username must be between 10 and 15 characters", ex.getMessage());
    }

    // Password blank
    @Test
    void testPasswordBlank_ShouldThrowException() {
        AuthenticationInputData input = new AuthenticationInputData("customer10", "");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> useCase.performSignupAuthentication(input));
        assertEquals("Password cannot be blank", ex.getMessage());
    }

    // Password length < 8
    @Test
    void testPasswordTooShort_ShouldThrowException() {
        AuthenticationInputData input = new AuthenticationInputData("customer10", "1234567");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> useCase.performSignupAuthentication(input));
        assertEquals("Password must be between 8 and 68 characters", ex.getMessage());
    }

    // Password length = 8
    @Test
    void testPasswordLength8_ShouldPass() {
        AuthenticationInputData input = new AuthenticationInputData("customer10", "12345678");
        assertDoesNotThrow(() -> useCase.performSignupAuthentication(input));
    }

    // Password length = 68
    @Test
    void testPasswordLength68_ShouldPass() {
        String longPwd = "p".repeat(68);
        AuthenticationInputData input = new AuthenticationInputData("customer10", longPwd);
        assertDoesNotThrow(() -> useCase.performSignupAuthentication(input));
    }

    // Password length > 68
    @Test
    void testPasswordTooLong_ShouldThrowException() {
        String longPwd = "p".repeat(69);
        AuthenticationInputData input = new AuthenticationInputData("customer10", longPwd);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> useCase.performSignupAuthentication(input));
        assertEquals("Password must be between 8 and 68 characters", ex.getMessage());
    }
}
