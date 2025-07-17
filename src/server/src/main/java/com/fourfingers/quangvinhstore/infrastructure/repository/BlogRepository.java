package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlogRepository extends JpaRepository<BlogEntity, Long> {
    List<BlogEntity> findAllByIsActiveTrue();
    Optional<BlogEntity> findByBlogIdAndIsActiveTrue(Long id);
}
