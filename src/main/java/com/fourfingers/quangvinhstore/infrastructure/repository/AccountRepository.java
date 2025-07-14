package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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


    @Query(value = """
    SELECT a.account_id, CONCAT(p.first_name, ' ', p.last_name) AS `full_name`,
    COUNT(o.order_id) AS total_processed_order,
    SUM(od.unit_price * od.quantity) AS total_revenue,
    a.created_by, a.created_at, a.updated_by, a.updated_at
    FROM accounts a
    INNER JOIN profiles p ON a.account_id = p.account_id
    LEFT JOIN orders o ON o.process_by = a.account_id
    LEFT JOIN order_details od ON od.order_id = o.order_id
    WHERE (a.working_at IS NOT NULL)
        AND (:accountId IS NULL OR a.account_id = :accountId)
    GROUP BY a.account_id, p.first_name, p.last_name, a.created_by,
    	a.created_at, a.updated_by, a.updated_at
""", nativeQuery = true
    )
    Page<Object[]> getStaffAccountWithCondition(
            Pageable pageable,
            @Param("accountId") Long accountId
    );

    boolean existsByUsername(String username);
}
