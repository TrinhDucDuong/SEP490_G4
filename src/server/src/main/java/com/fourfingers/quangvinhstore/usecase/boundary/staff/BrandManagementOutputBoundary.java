package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Brand;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBrandOutputData;

import java.util.List;

public interface BrandManagementOutputBoundary {
    ListBrandOutputData convertToListBrandOutputData(List<Brand> brands);
    BrandOutputData convertToBrandOutputData(Brand brand);
}
