package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Brand;
import com.fourfingers.quangvinhstore.usecase.data.output.brand.ListBrandOutputData;

import java.util.List;

public interface BrandOutputBoundary {
    ListBrandOutputData convertToListBrandOutputData(List<Brand> brands);
}
