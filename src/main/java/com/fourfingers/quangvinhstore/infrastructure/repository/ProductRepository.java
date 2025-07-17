package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long>,
        JpaSpecificationExecutor<ProductEntity> {

    List<ProductEntity> findAllByIsActiveTrue();

    Optional<ProductEntity> findByProductIdAndIsActiveTrue(Long productId);

    List<ProductEntity> findByProductNameContainingIgnoreCase(String productName);

    @Query(value = """
            SELECT
            p.product_id,
            p.product_name,
            p.product_description,
            p.unit_price,
            COALESCE(AVG(sr_data.star_rate_avg), 0) AS star_rate_avg_all,
            COALESCE(SUM(od_data.total_sold_out), 0) AS total_sold_out_all
            FROM products p
            JOIN product_variants pv ON p.product_id = pv.product_id
            LEFT JOIN (
                SELECT sr.product_variant_id, AVG(sr.star_rate) AS star_rate_avg
                FROM star_rates sr
                GROUP BY sr.product_variant_id
            ) sr_data ON sr_data.product_variant_id = pv.product_variant_id
            
            LEFT JOIN (
                SELECT od.product_variant_id, SUM(od.quantity) AS total_sold_out
                FROM order_details od
                GROUP BY od.product_variant_id
            ) od_data ON od_data.product_variant_id = pv.product_variant_id
            JOIN colors c ON pv.color_code = c.color_code
            WHERE (:minPrice IS NULL OR p.unit_price >= :minPrice)
                AND (:maxPrice IS NULL OR p.unit_price <= :maxPrice)
                AND (:categoryIds IS NULL OR FIND_IN_SET(p.category_id, :categoryIds) > 0)
                AND (:brandIds IS NULL OR FIND_IN_SET(p.brand_id, :brandIds) > 0)
                AND (:colorHexes IS NULL OR FIND_IN_SET(pv.color_code, :colorHexes) > 0)
                AND (:productSizes IS NULL OR FIND_IN_SET(pv.size_code, :productSizes) > 0)
                AND (:searchText IS NULL OR p.product_name LIKE CONCAT('%', :searchText, '%'))
            GROUP BY p.product_id, p.product_name, p.product_description, p.unit_price
            ORDER BY
                CASE WHEN :sortBy = 'unitPrice' AND :sortDirection = 'asc' THEN p.unit_price END ASC,
                CASE WHEN :sortBy = 'unitPrice' AND :sortDirection = 'desc' THEN p.unit_price END DESC,
                CASE WHEN :sortBy = 'starRateAvg' AND :sortDirection = 'asc' THEN star_rate_avg_all END ASC,
                CASE WHEN :sortBy = 'starRateAvg' AND :sortDirection = 'desc' THEN star_rate_avg_all END DESC,
                CASE WHEN :sortBy = 'totalSoldOut' AND :sortDirection = 'asc' THEN total_sold_out_all END ASC,
                CASE WHEN :sortBy = 'totalSoldOut' AND :sortDirection = 'desc' THEN total_sold_out_all END DESC,
                CASE WHEN :sortBy = 'createdAt' AND :sortDirection = 'asc' THEN created_at END ASC,
                CASE WHEN :sortBy = 'createdAt' AND :sortDirection = 'desc' THEN created_at END DESC
            """,
            countQuery = """
            SELECT COUNT(DISTINCT p.product_id)
            FROM products p
            JOIN product_variants pv ON p.product_id = pv.product_id
            JOIN colors c ON pv.color_code = c.color_code
            WHERE (:minPrice IS NULL OR p.unit_price >= :minPrice)
                AND (:maxPrice IS NULL OR p.unit_price <= :maxPrice)
                AND (:categoryIds IS NULL OR FIND_IN_SET(p.category_id, :categoryIds) > 0)
                AND (:brandIds IS NULL OR FIND_IN_SET(p.brand_id, :brandIds) > 0)
                AND (:colorHexes IS NULL OR FIND_IN_SET(pv.color_code, :colorHexes) > 0)
                AND (:productSizes IS NULL OR FIND_IN_SET(pv.size_code, :productSizes) > 0)
                AND (:searchText IS NULL OR p.product_name LIKE CONCAT('%', :searchText, '%'))
            """,
            nativeQuery = true)
    Page<Object[]> searchProduct(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("categoryIds") String categoryIds,
            @Param("brandIds") String brandIds,
            @Param("colorHexes") String colorHexes,
            @Param("productSizes") String productSizes,
            @Param("sortDirection") String sortDirection,
            @Param("sortBy") String sortBy,
            @Param("searchText") String searchText,
            Pageable pageable
    );

    List<ProductEntity> findAllByIsActiveTrueAndProductIdIn(List<Long> relatedProductIds);
}
