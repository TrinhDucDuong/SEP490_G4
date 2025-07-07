package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.ActionLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActionLogRepository extends JpaRepository<ActionLogEntity, Long> {
    List<ActionLogEntity> findTop20ActionLogEntitiesByPerformerIdOrderByActionTimeDesc(Long performerId);
}
