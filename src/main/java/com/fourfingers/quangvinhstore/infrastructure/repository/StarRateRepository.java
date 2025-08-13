package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface StarRateRepository extends JpaRepository<StarRateEntity, Long>,
        JpaSpecificationExecutor<StarRateEntity> {

    Optional<StarRateEntity> findByOrderDetailsId(Long orderDetailsIdL);
    List<StarRateEntity> findByStarRateIsNotNull();
}
