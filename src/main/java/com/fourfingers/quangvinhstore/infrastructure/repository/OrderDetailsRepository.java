package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.OrderDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetailsEntity, Long> {
    List<OrderDetailsEntity> findByOrder_OrderId(Long orderId);

    Optional<OrderDetailsEntity> findByOrderDetailsId(Long orderDetailsId);
}