package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findAllByOrderStatus(OrderStatus orderStatus);
    List<OrderEntity> findAllByOwnerAccountId(Long ownerAccountId);
    Optional<OrderEntity> findByOrderIdAndOwnerAccountId(Long orderId, Long ownerAccountId);

    Optional<OrderEntity> findBySecureHash(String secureHash);
}
