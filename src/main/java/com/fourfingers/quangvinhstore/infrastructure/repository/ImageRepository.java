package com.fourfingers.quangvinhstore.infrastructure.repository;

import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ImageRepository extends JpaRepository<ImageEntity, UUID> {
    List<ImageEntity> findAllByReferenceIdAndImageType(UUID referenceId, ImageType imageType);
    List<ImageEntity> findAllByImageType(ImageType imageType);
}
