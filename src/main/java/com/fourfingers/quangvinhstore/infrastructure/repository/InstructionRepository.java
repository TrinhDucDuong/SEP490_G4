package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstructionRepository extends JpaRepository<InstructionEntity, Long> {

}
