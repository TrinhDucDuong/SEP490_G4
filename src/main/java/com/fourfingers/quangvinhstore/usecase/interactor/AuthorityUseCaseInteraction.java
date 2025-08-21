package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProfileRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthorityUseCaseInteraction implements CommandLineRunner {

    private final AuthorityRepository authorityRepository;

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;
    private final ProfileRepository profileRepository;

    @Override
    @Transactional
    public void run(String... args) {
        createRoleIfNotExists("CUSTOMER");
        createRoleIfNotExists("STAFF");
        createRoleIfNotExists("ADMINISTRATOR");
        createAdminAccountIfNotExists();
    }

    private void createRoleIfNotExists(String name) {
        authorityRepository.findById(name).orElseGet(() -> {
                    AuthorityEntity newAuthority = new AuthorityEntity();
                    newAuthority.setAuthorityName(name);
                    return authorityRepository.save(newAuthority);
                });
    }

    private void createAdminAccountIfNotExists() {
        String adminUsername = "admin";
        String adminPassword = "123456";

        if (!accountRepository.existsByUsername(adminUsername)) {
            AccountEntity admin = new AccountEntity();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword)); // passwordEncoder là bean của Spring Security
            admin.setActive(true);

            AuthorityEntity adminRole = authorityRepository.findById("ADMINISTRATOR")
                    .orElseThrow(() -> new RuntimeException("Role ADMINISTRATOR chưa tồn tại"));

            AuthorityEntity staffRole = authorityRepository.findById("STAFF")
                    .orElseThrow(() -> new RuntimeException("Role STAFF chưa tồn tại"));

            AuthorityEntity customerRole = authorityRepository.findById("CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("Role CUSTOMER chưa tồn tại"));

            admin.setAuthorities(List.of(adminRole, staffRole, customerRole));

            AccountEntity accountAdmin = accountRepository.save(admin);

            ProfileEntity needToCreateProfileEntity = ProfileEntity.builder()
                    .account(accountAdmin)
                    .firstName("Quang")
                    .lastName("Vinh")
                    .phoneNumber("0984073408")
                    .createdAt(LocalDateTime.now())
                    .build();
            profileRepository.save(needToCreateProfileEntity);
        }
    }
}
