package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.BrandInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBrandOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface BrandManagementInputBoundary {
    ListBrandOutputData getAll();
    BrandOutputData getBrand(String brandId);
    BrandOutputData create(BrandInputData input, UserDetails userDetails) throws Exception;
    BrandOutputData save(String brandId, BrandInputData input, UserDetails userDetails) throws Exception;
    BrandOutputData delete(String brandId);
}
