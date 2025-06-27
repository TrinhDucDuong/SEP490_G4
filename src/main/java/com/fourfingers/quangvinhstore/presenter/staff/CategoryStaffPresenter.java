package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Category;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListCategoryOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryStaffPresenter implements CategoryManagementOutputBoundary {

    @Override
    public ListCategoryOutputData convertToListCategoryOutputData(List<Category> categories) {
        return new ListCategoryOutputData(categories);
    }

    @Override
    public CategoryOutputData convertToCategoryOutputData(Category category) {
        return new CategoryOutputData(category);
    }
}
