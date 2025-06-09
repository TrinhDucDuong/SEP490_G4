package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.auth.AuthenticationOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthenticationUseCaseInteraction implements AuthenticationInputBoundary, UserDetailsService {
    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final AuthenticationOutputBoundary authenticationOutputBoundary;
    private final JwtUtilBoundary jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("User not found"));
    }

    @Override
    public AuthenticationOutputData performAuthentication(AuthenticationInputData data) {
        UserDetails userDetails = loadUserByUsername(data.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        Account userAccount = accountMapper.toAccount((AccountEntity) userDetails);
        return authenticationOutputBoundary.convertToOutputData(userAccount, token);
    }
}
