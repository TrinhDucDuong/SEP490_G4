package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Brand;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListBrandOutputData;

import java.util.List;

public interface BrandOutputBoundary {
    ListBrandOutputData convertToListBrandOutputData(List<Brand> brands);
}
