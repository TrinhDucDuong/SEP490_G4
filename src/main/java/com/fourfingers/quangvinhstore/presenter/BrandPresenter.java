package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.customer.Brand;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BrandOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.brand.ListBrandOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BrandPresenter implements BrandOutputBoundary {
    @Override
    public ListBrandOutputData convertToListBrandOutputData(List<Brand> brands) {
        return new ListBrandOutputData(brands);
    }
}
