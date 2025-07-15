package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.ShippingAddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddressEntity, Long> {
    List<ShippingAddressEntity> findAllByAccount_AccountId(Long accountAccountId);

    Optional<ShippingAddressEntity> findByAccount_AccountIdAndShippingAddressId(Long accountAccountId, Long shippingAddressId);

    List<ShippingAddressEntity> findAllByAccount_AccountIdAndIsMain(Long accountAccountId, Boolean isMain);
}
