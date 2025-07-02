package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Authority;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AuthorityMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.SNSAuthInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSAuthInputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSAuthUseCaseInteraction implements SNSAuthInputBoundary {
    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final AuthorityRepository authorityRepository;
    private final AuthenticationOutputBoundary authenticationOutputBoundary;
    private final JwtUtilBoundary jwtUtil;
    private final AuthorityMapper authorityMapper;
    private final JavaMailSender mailSender;
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public AuthenticationOutputData performGoogleAuthentication(SNSAuthInputData data) {
        AccountEntity accountEntity = accountRepository.findByEmail(data.getEmail()).orElse(null);
        if (accountEntity == null) {
            AccountEntity newAccount = new AccountEntity();
            newAccount.setEmail(data.getEmail());
            //TODO: Set default profile + image + created at
            AuthorityEntity authority = authorityRepository.findById("Customer")
                    .orElseGet(() -> {
                        AuthorityEntity newAuthority = new AuthorityEntity();
                        newAuthority.setAuthorityName("Customer");
                        return authorityRepository.save(newAuthority);
                    });

            newAccount.setAuthorities(List.of(authority));

            accountRepository.save(newAccount);
        }
        accountEntity = accountRepository.findByEmail(data.getEmail()).orElseThrow(() -> new AccountNotFoundException("Login via Google failed!"));

        String token = jwtUtil.generateToken(accountEntity);
        List<Authority> authorities = List.of(
                accountEntity.getAuthorities()
                        .stream()
                        .map((authorityEntity) -> authorityMapper.toModel((AuthorityEntity) authorityEntity))
                        .toArray(Authority[]::new)
        );
        Account userAccount = accountMapper.toAccount(accountEntity);
//        userAccount.setAuthorities(authorities);
        return authenticationOutputBoundary.convertToOutputData(userAccount, token);
    }

    @Override
    public AuthenticationOutputData performFacebookAuthentication(SNSAuthInputData data) {
        AccountEntity accountEntity = accountRepository.findByFacebookId(data.getFacebookId()).orElse(null);
        if (accountEntity == null) {
            AccountEntity newAccount = new AccountEntity();
            newAccount.setFacebookId(data.getFacebookId());
            //TODO: Set default profile + image + created at + is active

            AuthorityEntity authority = authorityRepository.findById("Customer")
                    .orElseGet(() -> {
                        AuthorityEntity newAuthority = new AuthorityEntity();
                        newAuthority.setAuthorityName("Customer");
                        return authorityRepository.save(newAuthority);
                    });

            newAccount.setAuthorities(List.of(authority));

            accountRepository.save(newAccount);
        }
        accountEntity = accountRepository.findByFacebookId(data.getFacebookId()).orElseThrow(() -> new AccountNotFoundException("Login via Facebook failed!"));

        String token = jwtUtil.generateToken(accountEntity);
        List<Authority> authorities = List.of(
                accountEntity.getAuthorities()
                        .stream()
                        .map((authorityEntity) -> authorityMapper.toModel((AuthorityEntity) authorityEntity))
                        .toArray(Authority[]::new)
        );
        Account userAccount = accountMapper.toAccount(accountEntity);
//        userAccount.setAuthorities(authorities);
        return authenticationOutputBoundary.convertToOutputData(userAccount, token);
    }

    @Override
    public void verifyCodeAndResetPassword(String email) {
        AccountEntity accountEntity = accountRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException("Email không tồn tại"));
        String tempPassword = generateTemporaryPassword();
        passwordEncoder = new BCryptPasswordEncoder();
        accountEntity.setPassword(passwordEncoder.encode(tempPassword));
        accountRepository.save(accountEntity);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mật khẩu tạm thời");
        message.setText("Mật khẩu tạm thời của bạn là: " + tempPassword +
                "\nVui lòng đăng nhập và đổi mật khẩu ngay.");
        mailSender.send(message);
    }

    private String generateTemporaryPassword() {
        return "temp123456789";
    }

}
