package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoryRepository extends JpaRepository<StoryEntity, UUID> {
    List<StoryEntity> findAllByIsActiveTrue();
    Optional<StoryEntity> findByStoryIdAndIsActiveTrue(UUID storyId);
}
