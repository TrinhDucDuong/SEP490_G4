package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Category;
import com.fourfingers.quangvinhstore.usecase.data.output.category.ListCategoryOutputData;

import java.util.List;

public interface CategoryOutputBoundary {
    ListCategoryOutputData convertToListCategoryOutputData(List<Category> categories);
}
