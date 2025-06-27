package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListCategoryOutputData;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryManagementInputBoundary {
    CategoryOutputData getCategory(String id);
    ListCategoryOutputData getAll();

    CategoryOutputData create(CategoryInputData categoryInputData, List<MultipartFile> categoryImages, UserDetails userDetails) throws Exception;
}
