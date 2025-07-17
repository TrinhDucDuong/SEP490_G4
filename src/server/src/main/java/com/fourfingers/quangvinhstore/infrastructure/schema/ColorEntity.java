package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "colors")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ColorEntity {
    @Id
    @Column(name = "color_code")
    private String colorHex;

    @OneToMany(mappedBy = "color", fetch = FetchType.LAZY)
    private List<ProductVariantEntity> productVariants;
}
