package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.CategoryEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<CategoryEntity, UUID> {
}
