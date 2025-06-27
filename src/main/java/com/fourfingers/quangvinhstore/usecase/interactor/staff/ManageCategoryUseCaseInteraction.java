package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Category;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.CategoryStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.CategoryEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListCategoryOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCategoryUseCaseInteraction implements CategoryManagementInputBoundary {
    private final CategoryStaffMapper categoryStaffMapper;
    private final CategoryManagementOutputBoundary categoryManagementOutputBoundary;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    @Override
    public CategoryOutputData getCategory(String id) {
        CategoryEntity categoryEntity;
        return null;
    }

    @Override
    @Transactional
    public ListCategoryOutputData getAll() {
        return categoryManagementOutputBoundary.convertToListCategoryOutputData(
                categoryRepository.findAll()
                        .stream()
                        .map(this::getCategory)
                        .toList()
        );
    }

    private Category getCategory(CategoryEntity categoryEntity) {
        Category category = categoryStaffMapper.toModel(categoryEntity);
        Category parentCategory = categoryStaffMapper.toModel(categoryEntity
                .getParentCategoryEntity());
        List<Category> childCategories = categoryEntity.getSubCategoryEntities()
                .stream().map(categoryStaffMapper::toModel).toList();
        category.setParentCategory(parentCategory);
        category.setSubCategories(childCategories);
        category.setImages(getImages(categoryEntity));
        return category;
    }

    private List<Image> getImages(CategoryEntity categoryEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(categoryEntity.getCategoryId(), ImageType.CATEGORY)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }
}
