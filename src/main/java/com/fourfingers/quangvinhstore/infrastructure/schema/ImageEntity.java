package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "images")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "image_id")
    private UUID imageId;

    @Column(name = "reference_id", nullable = false)
    private UUID referenceId;

    @Column(name = "image_type")
    private ImageType imageType;

    @Column(name = "image_url", columnDefinition = "TEXT", nullable = false)
    private String imageUrl;

    @Column(name = "isActive", columnDefinition = "BIT DEFAULT 1", nullable = false)
    private Boolean isActive;
}
