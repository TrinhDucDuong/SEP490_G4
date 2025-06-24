package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.input.product.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface ProductManagementInputBoundary {
    ProductOutputData save(ProductInputData productInputData, UserDetails userDetails) throws Exception;
}
