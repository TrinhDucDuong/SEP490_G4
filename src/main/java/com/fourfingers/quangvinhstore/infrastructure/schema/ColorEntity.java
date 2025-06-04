package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "colors")
public class ColorEntity {
    @Id
    @Column(name = "color_code")
    private String colorHexCode;

    @Column(name = "color_name", columnDefinition = "NVARCHAR(50)")
    private String colorName;

    @OneToMany(mappedBy = "color", fetch = FetchType.LAZY)
    private List<ProductVariantEntity> productVariants;
}
