package com.fourfingers.quangvinhstore.usecase.data.input.product;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderByClause {
    private String field;
    private SortDirection direction;
}
