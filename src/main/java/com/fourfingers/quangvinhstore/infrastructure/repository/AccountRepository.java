package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    Optional<AccountEntity> findByUsername(String username);
    Optional<AccountEntity> findByEmail(String email);
    Optional<AccountEntity> findByEmailAndAccountIdNot(String email, Long id);
    Optional<AccountEntity> findByUsernameAndAccountIdNot(String username, Long id);
    Optional<AccountEntity> findByFacebookId(String facebookId);
    boolean findByPassword(String password);
    Optional<AccountEntity> findByEmailAndResetToken(String email, String token);
}
