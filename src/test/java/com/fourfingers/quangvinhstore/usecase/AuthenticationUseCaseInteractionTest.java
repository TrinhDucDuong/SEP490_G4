package com.fourfingers.quangvinhstore.usecase;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Authority;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AuthorityMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.AuthenticationUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class AuthenticationUseCaseInteractionTest {
    @Mock
    private AccountMapper accountMapper;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private AuthenticationOutputBoundary authenticationOutputBoundary;
    @Mock
    private JwtUtilBoundary jwtUtil;
    @Mock
    private AuthorityMapper authorityMapper;

    @InjectMocks
    private AuthenticationUseCaseInteraction authenticationUseCaseInteraction;

    private AccountEntity mockAccountEntity;
    private Account mockAccount;
    private AuthenticationInputData mockInputData;
    private AuthenticationOutputData mockOutputData;
    private AuthorityEntity mockAuthorityEntity;
    private Authority mockAuthority;

    @BeforeEach
    void setUp() {
        mockAccountEntity = new AccountEntity();
        mockAccount = new Account();
        mockInputData = new AuthenticationInputData("testUser", "testPass");
        mockOutputData = new AuthenticationOutputData();
        mockAuthorityEntity = new AuthorityEntity();
        mockAuthority = new Authority();
        mockAccountEntity.setAuthorities(List.of(mockAuthorityEntity));
    }

    @Test
    void testLoadUserByUsernameSuccess() {
        when(accountRepository.findByUsername("testUser")).thenReturn(java.util.Optional.of(mockAccountEntity));

        UserDetails result = authenticationUseCaseInteraction.loadUserByUsername("testUser");

        assertEquals(mockAccountEntity, result);
        verify(accountRepository).findByUsername("testUser");
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(accountRepository.findByUsername("missingUser")).thenReturn(java.util.Optional.empty());

        assertThrows(
                org.springframework.security.core.userdetails.UsernameNotFoundException.class,
                () -> authenticationUseCaseInteraction.loadUserByUsername("missingUser")
        );

        verify(accountRepository).findByUsername("missingUser");
    }

    @Test
    void testPerformAuthenticationSuccess() {
        when(accountRepository.findByUsername("testUser")).thenReturn(java.util.Optional.of(mockAccountEntity));
        when(jwtUtil.generateToken(mockAccountEntity)).thenReturn("mockToken");
        when(authorityMapper.toModel(mockAuthorityEntity)).thenReturn(mockAuthority);
        when(accountMapper.toAccount(mockAccountEntity)).thenReturn(mockAccount);
        when(authenticationOutputBoundary.convertToOutputData(mockAccount, "mockToken")).thenReturn(mockOutputData);

        AuthenticationOutputData result = authenticationUseCaseInteraction.performAuthentication(mockInputData);

        assertNotNull(result);
        assertEquals(mockOutputData, result);

        verify(accountRepository).findByUsername("testUser");
        verify(jwtUtil).generateToken(mockAccountEntity);
        verify(authorityMapper).toModel(mockAuthorityEntity);
        verify(accountMapper).toAccount(mockAccountEntity);
        verify(authenticationOutputBoundary).convertToOutputData(mockAccount, "mockToken");
    }
}
