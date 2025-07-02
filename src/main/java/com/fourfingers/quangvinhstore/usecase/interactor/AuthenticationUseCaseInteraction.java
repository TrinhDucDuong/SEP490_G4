package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.CustomerRegistedAccount;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProfileRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.account.CustomerRegistedAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;


@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthenticationUseCaseInteraction implements AuthenticationInputBoundary, UserDetailsService {
    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final CartUseCaseInteraction cartUseCaseInteraction;
    private final AuthenticationOutputBoundary authenticationOutputBoundary;
    private final JwtUtilBoundary jwtUtil;
    private final AuthorityRepository authorityRepository;
    private final ProfileRepository profileRepository;
    private final ImageRepository imageRepository;

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
        Account userAccount = accountMapper.toAccount(accountEntity);
        return authenticationOutputBoundary.convertToOutputData(userAccount, token);
    }

    @Override
    public CustomerRegistedAccountOutputData performSignupAuthentication(AuthenticationInputData data) throws UsernameNotFoundException {
        if(accountRepository.findByUsername(data.getUsername()).isEmpty()){
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            AccountEntity newAccount = new AccountEntity();
            newAccount.setUsername(data.getUsername());
            newAccount.setPassword(passwordEncoder.encode(data.getPassword()));
            newAccount.setActive(true);
            newAccount.setCreatedAt(LocalDateTime.now());

            AuthorityEntity authority = authorityRepository.findById("Customer")
                    .orElseGet(() -> {
                        AuthorityEntity newAuthority = new AuthorityEntity();
                        newAuthority.setAuthorityName("Customer");
                        return authorityRepository.save(newAuthority);
                    });

            newAccount.setAuthorities(List.of(authority));

            AccountEntity savedAccount = accountRepository.save(newAccount);
            //Create default profile + image
            saveDefaultProfile(savedAccount);
            CustomerRegistedAccount customerRegistedAccount = CustomerRegistedAccount
                    .builder()
                    .username(data.getUsername())
                    .password(data.getPassword())
                    .build();
            return authenticationOutputBoundary.convertToOutputData(customerRegistedAccount);
        } else {
            throw new UsernameNotFoundException("Username already exists: " + data.getUsername());
        }
    }

    private void saveDefaultProfile(AccountEntity savedAccount) {
        ProfileEntity needToCreatedProfile = ProfileEntity.builder()
                //TODO: add more information
                .account(savedAccount)
                .firstName("Khách Hàng Vip")
                .build();
        ProfileEntity savedProfile = profileRepository.save(needToCreatedProfile);
        savedDefaultImage(savedProfile);
    }

    private void savedDefaultImage(ProfileEntity savedProfile) {
        ImageEntity needToCreatedImage = ImageEntity.builder()
                .imageUrl("http://localhost:9999/images/default-profile.png")
                .imageType(ImageType.PROFILE)
                .isActive(true)
                .referenceId(savedProfile.getProfileId())
                .build();
        imageRepository.save(needToCreatedImage);
    }
}
