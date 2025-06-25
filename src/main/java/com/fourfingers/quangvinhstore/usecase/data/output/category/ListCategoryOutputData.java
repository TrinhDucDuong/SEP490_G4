package com.fourfingers.quangvinhstore.usecase.data.output.category;

import com.fourfingers.quangvinhstore.domain.model.customer.Category;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListCategoryOutputData {
    List<Category> categoryList;
}
