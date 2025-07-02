package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.SNSEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SNSRepository extends JpaRepository<SNSEntity, Long> {
    List<SNSEntity> findAllByIsActiveTrue();
    SNSEntity save(SNSEntity snsEntity);
    void delete(SNSEntity snsEntity);
    Optional<SNSEntity> findBySnsIdAndIsActiveTrue(Long snsId);
}
