package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Brand;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BrandManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBrandOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BrandStaffPresenter implements BrandManagementOutputBoundary {
    @Override
    public ListBrandOutputData convertToListBrandOutputData(List<Brand> brands) {
        return new ListBrandOutputData(brands);
    }

    @Override
    public BrandOutputData convertToBrandOutputData(Brand brand) {
        return new BrandOutputData(brand);
    }
}
