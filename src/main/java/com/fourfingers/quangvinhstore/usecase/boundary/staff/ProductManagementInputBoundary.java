package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.customer.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductWithVariantsOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface ProductManagementInputBoundary {
    ProductOutputData create(ProductInputData productInputData, UserDetails userDetails) throws Exception;
    ListProductOutputData findAllProductWithNameContains(String name);
    ProductOutputData update(String id, ProductInputData productInputData, UserDetails userDetails) throws Exception;
    ProductOutputData delete(String id, UserDetails userDetails) throws Exception;
    ProductWithVariantsOutputData getProduct(String id);
}
