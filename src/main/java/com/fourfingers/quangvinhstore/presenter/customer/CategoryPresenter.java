package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Category;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CategoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCategoryOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryPresenter implements CategoryOutputBoundary {

    @Override
    public ListCategoryOutputData convertToListCategoryOutputData(List<Category> categories) {
        return new ListCategoryOutputData(categories);
    }
}
