package com.fourfingers.quangvinhstore.usecase.data.input.product;

import com.fourfingers.quangvinhstore.domain.model.enums.ProductSizeEnum;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SearchProductInputData {
    private List<String> categoryIds;
    private List<String> brandIds;
    private List<ProductSizeEnum> productSizes;
    private List<String> colorHexes;
    private BigDecimal price;
    private List<OrderByClause> orderByClauses;
}