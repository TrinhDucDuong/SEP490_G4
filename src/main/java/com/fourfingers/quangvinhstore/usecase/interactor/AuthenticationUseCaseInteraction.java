package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Authority;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AuthorityMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.auth.AuthenticationOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthenticationUseCaseInteraction implements AuthenticationInputBoundary, UserDetailsService {
    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final AuthenticationOutputBoundary authenticationOutputBoundary;
    private final JwtUtilBoundary jwtUtil;
    private final AuthorityMapper authorityMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public AuthenticationOutputData performAuthentication(AuthenticationInputData data) {
        AccountEntity accountEntity = (AccountEntity) loadUserByUsername(data.getUsername());
        String token = jwtUtil.generateToken(accountEntity);
        List<Authority> authorities = List.of(
                accountEntity.getAuthorities()
                        .stream()
                        .map((authorityEntity) -> {
                            return authorityMapper.toModel((AuthorityEntity) authorityEntity);
                        })
                        .toArray(Authority[]::new)
        );
        Account userAccount = accountMapper.toAccount(accountEntity);
        userAccount.setAuthorities(authorities);
        return authenticationOutputBoundary.convertToOutputData(userAccount, token);
    }
}
