package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface ProductManagementInputBoundary {
    ProductOutputData create(ProductInputData productInputData, UserDetails userDetails) throws Exception;
    ListProductOutputData findAllProducts(String name);
    ProductOutputData update(String id, ProductInputData productInputData, UserDetails userDetails) throws Exception;
    ProductOutputData delete(String id, UserDetails userDetails) throws Exception;
    ProductOutputData getProduct(String id);
}
