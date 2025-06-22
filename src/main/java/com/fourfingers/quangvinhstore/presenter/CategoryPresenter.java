package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Category;
import com.fourfingers.quangvinhstore.usecase.boundary.CategoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.category.ListCategoryOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryPresenter implements CategoryOutputBoundary {

    @Override
    public ListCategoryOutputData convertToListCategoryOutputData(List<Category> categories) {
        return new ListCategoryOutputData(categories);
    }
}
