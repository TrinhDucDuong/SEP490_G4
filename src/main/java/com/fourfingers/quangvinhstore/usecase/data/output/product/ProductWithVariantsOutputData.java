package com.fourfingers.quangvinhstore.usecase.data.output.product;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductVariant;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductWithVariantsOutputData {
    private Product product;
    private List<ProductVariant> productVariants;
}
