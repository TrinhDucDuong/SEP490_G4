package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.domain.model.admin.CategorySalesReport;
import com.fourfingers.quangvinhstore.infrastructure.schema.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findByCategoryIdAndIsActiveIsTrue(Long categoryId);

    @Query("""
                SELECT new com.fourfingers.quangvinhstore.domain.model.admin.CategorySalesReport (
                     c.categoryName,
                     SUM(od.quantity)
                )
                FROM CategoryEntity c
                LEFT JOIN CategoryEntity  sc ON c.categoryId = sc.parentCategoryEntity.categoryId
                LEFT JOIN ProductEntity p ON p.category.categoryId = sc.categoryId
                            OR p.category.categoryId = c.categoryId
                JOIN ProductVariantEntity pv ON pv.product.productId = p.productId
                LEFT JOIN OrderDetailsEntity od ON od.productVariant.productVariantId = pv.productVariantId
                JOIN OrderEntity o ON od.order.orderId = o.orderId
                WHERE o.orderDate >= :startTime
                      AND o.orderDate <= :endTime
                GROUP BY c.categoryName
            """)
    List<CategorySalesReport> getCategorySalesReport(
            @Param("startTime")LocalDateTime startTime,
            @Param("endTime")LocalDateTime endTime
    );

    boolean existsByCategoryName(String categoryName);
}
