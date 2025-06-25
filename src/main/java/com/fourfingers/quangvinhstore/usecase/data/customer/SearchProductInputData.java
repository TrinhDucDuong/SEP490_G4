package com.fourfingers.quangvinhstore.usecase.data.customer;

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
    private List<String> productSizes;
    private List<String> colorHexes;
    private BigDecimal price;
}