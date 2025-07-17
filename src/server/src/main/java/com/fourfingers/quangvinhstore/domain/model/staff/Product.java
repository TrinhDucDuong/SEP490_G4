package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.Image;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    private Long productId;
    private String productName;
    private String productDescription;
    private Boolean isActive;
    private BigDecimal unitPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Account createdBy;
    private Account updatedBy;
    private List<Image> images;
    private List<ProductVariant> productVariants;
    private Brand brand;
    private Category category;
}
