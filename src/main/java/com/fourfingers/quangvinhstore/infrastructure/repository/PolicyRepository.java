package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<PolicyEntity, Long> {
    List<PolicyEntity> findAllByIsActive(Boolean isActive);
}
