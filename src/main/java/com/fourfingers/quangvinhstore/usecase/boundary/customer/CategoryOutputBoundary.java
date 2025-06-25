package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Category;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCategoryOutputData;

import java.util.List;

public interface CategoryOutputBoundary {
    ListCategoryOutputData convertToListCategoryOutputData(List<Category> categories);
}
