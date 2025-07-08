package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.ShippingAddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddressEntity, Long> {
    List<ShippingAddressEntity> findAllByAccount_AccountId(Long accountAccountId);

    ShippingAddressEntity findByAccount_AccountIdAndShippingAddressId(Long accountAccountId, Long shippingAddressId);
}
