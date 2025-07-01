package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoryRepository extends JpaRepository<StoryEntity, Long> {
    List<StoryEntity> findAllByIsActiveTrue();
    Optional<StoryEntity> findByStoryIdAndIsActiveTrue(Long storyId);
}
