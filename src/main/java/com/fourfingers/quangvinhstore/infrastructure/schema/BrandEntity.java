package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "brands")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BrandEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id", nullable = false, updatable = false, unique = true)
    public Long brandId;

    @Column(name = "brand_name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String brandName;

    @Column(name = "brand_description", columnDefinition = "TEXT", nullable = false)
    private String brandDescription;
}
