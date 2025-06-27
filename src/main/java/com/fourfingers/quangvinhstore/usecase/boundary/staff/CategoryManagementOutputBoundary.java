package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Category;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListCategoryOutputData;

import java.util.List;

public interface CategoryManagementOutputBoundary {
    ListCategoryOutputData convertToListCategoryOutputData(List<Category> categories);
    CategoryOutputData convertToCategoryOutputData(Category category);
}
