package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long>,
        JpaSpecificationExecutor<ProductEntity> {
    @Query("SELECT p FROM ProductEntity p " +
            "JOIN p.starRates s GROUP BY p " +
            "ORDER BY AVG(s.starRate) DESC")
    List<ProductEntity> findTop10ProductWithHighestStarRate(Pageable pageable);

    List<ProductEntity> findAllByIsActiveTrue();

    List<ProductEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
