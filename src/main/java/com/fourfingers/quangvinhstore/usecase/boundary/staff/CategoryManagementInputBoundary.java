package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListCategoryOutputData;

public interface CategoryManagementInputBoundary {
    CategoryOutputData getCategory(String id);
    ListCategoryOutputData getAll();
}
