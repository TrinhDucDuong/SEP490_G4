package com.fourfingers.quangvinhstore.infrastructure.schema;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "sizes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SizeEntity {
    @Id
    @Column(name = "size_code")
    private String sizeCode;

    @Column(name = "description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @OneToMany(mappedBy = "size", fetch = FetchType.LAZY)
    private List<ProductVariantEntity> productVariants;
}
