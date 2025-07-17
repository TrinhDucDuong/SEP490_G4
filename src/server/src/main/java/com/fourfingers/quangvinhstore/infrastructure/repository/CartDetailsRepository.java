package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.CartDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailsRepository extends JpaRepository<CartDetailsEntity, Long> {
    List<CartDetailsEntity> findByAccount_AccountId(Long accountAccountId);

    Optional<CartDetailsEntity> findByAccount_AccountIdAndProductVariant_ProductVariantId(Long accountAccountId, Long productVariantId);

    void deleteByAccount_AccountId(Long accountAccountId);
    
}
