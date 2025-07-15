package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import com.fourfingers.quangvinhstore.infrastructure.schema.OrderEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findAllByOrderStatus(OrderStatus orderStatus);

    List<OrderEntity> findAllByOwnerAccountId(Long ownerAccountId);

    Long countByOrderDateBetween(LocalDateTime start, LocalDateTime now);

    @Query("""
                SELECT COUNT(DISTINCT o.owner.accountId)
                FROM OrderEntity o
                WHERE o.orderDate BETWEEN :start AND :end
            """)
    Long countBuyingCustomers(@Param("start") LocalDateTime start,
                              @Param("end") LocalDateTime end);

    @Query("""
                SELECT SUM(od.quantity * od.unitPrice)
                FROM OrderDetailsEntity od
                JOIN od.order o
                WHERE o.paymentStatus = true
                AND o.orderDate BETWEEN :start AND :end
            """)
    BigDecimal getTotalRevenueBetween(@Param("start") LocalDateTime start,
                                      @Param("end") LocalDateTime end);

    @Query("""
                SELECT new com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue(
                    o.orderDate,
                    COALESCE(SUM(d.quantity * d.unitPrice), 0)
                )
                FROM OrderDetailsEntity d
                JOIN d.order o
                WHERE o.paymentStatus = true
                  AND o.orderDate BETWEEN :start AND :end
                GROUP BY o.orderDate
                ORDER BY o.orderDate
            """)
    List<DailyRevenue> getRevenuePerDay(@Param("start") LocalDateTime start,
                                        @Param("end") LocalDateTime end);

    Long countByOrderStatus(OrderStatus orderStatus);
}
