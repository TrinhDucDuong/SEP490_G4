package com.fourfingers.quangvinhstore.domain.model.admin;

import lombok.*;

import java.util.Objects;

@NoArgsConstructor
@Getter
@Setter
public class CategorySalesReport {
    private String categoryName;
    private Long totalSales;

    public CategorySalesReport(String categoryName, Long totalSales) {
        this.categoryName = categoryName;
        this.totalSales = Objects.requireNonNullElse(totalSales, 0L);
    }

}
