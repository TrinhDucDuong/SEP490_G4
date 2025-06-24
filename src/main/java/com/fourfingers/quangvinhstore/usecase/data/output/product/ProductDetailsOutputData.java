package com.fourfingers.quangvinhstore.usecase.data.output.product;

import com.fourfingers.quangvinhstore.domain.model.Color;
import com.fourfingers.quangvinhstore.domain.model.Product;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductDetailsOutputData {
    private Product product;
    private List<String> productSizes;
    private List<Color> productColors;
}
