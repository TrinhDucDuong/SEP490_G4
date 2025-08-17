package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.AuthorityRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthorityUseCaseInteraction implements CommandLineRunner {

    private final AuthorityRepository authorityRepository;

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
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
//            admin.setEmail("");

            AuthorityEntity adminRole = authorityRepository.findById("ADMINISTRATOR")
                    .orElseThrow(() -> new RuntimeException("Role ADMINISTRATOR chưa tồn tại"));

            admin.setAuthorities(List.of(adminRole));

            accountRepository.save(admin);
        }
    }
}
