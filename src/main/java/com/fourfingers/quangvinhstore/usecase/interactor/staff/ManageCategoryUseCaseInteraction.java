package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Category;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.CategoryStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.CategoryEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListCategoryOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCategoryUseCaseInteraction implements CategoryManagementInputBoundary {
    private final CategoryStaffMapper categoryStaffMapper;
    private final CategoryManagementOutputBoundary categoryManagementOutputBoundary;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final AzureStorageBoundary azureStorageBoundary;
    @Override
    public CategoryOutputData getCategory(String id) {
        Long categoryId = Long.valueOf(id);
        CategoryEntity categoryEntity = categoryRepository.findById(categoryId).orElseThrow(
                () -> new RuntimeException("Category not found")
        );
        Category category = getCategory(categoryEntity);
        return categoryManagementOutputBoundary.convertToCategoryOutputData(category);
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

    @Override
    public CategoryOutputData create(CategoryInputData categoryInputData, List<MultipartFile> categoryImages, UserDetails userDetails) throws Exception {
        CategoryEntity parentCategoryEntity = null;
        if (categoryInputData.getParentCategoryId() != null) {
            parentCategoryEntity = categoryRepository.findById(Long.valueOf(categoryInputData
                    .getParentCategoryId())).orElseThrow(
                    () -> new RuntimeException("Parent category not found")
            );
        }
        CategoryEntity needToCreateCategory = CategoryEntity.builder()
                .createdAt(LocalDateTime.now())
                .createdBy((AccountEntity) userDetails)
                .categoryName(categoryInputData.getCategoryName())
                .parentCategoryEntity(parentCategoryEntity)
                .isActive(true)
                .build();
        CategoryEntity savedCategoryEntity = categoryRepository.saveAndFlush(needToCreateCategory);
        Category category = categoryStaffMapper.toModel(savedCategoryEntity);
        category.setImages(saveCategoryImages(categoryImages, savedCategoryEntity));
        if (parentCategoryEntity != null) {
            category.setParentCategory(categoryStaffMapper.toModel(parentCategoryEntity));
        }
        return categoryManagementOutputBoundary.convertToCategoryOutputData(category);
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

    private List<Image> saveCategoryImages(List<MultipartFile> categoryImages, CategoryEntity categoryEntity) throws Exception {
        List<String> imageUrls = azureStorageBoundary.uploadMany(categoryImages);
        List<ImageEntity> imageEntities = imageUrls.stream()
                .map(imageUrl -> ImageEntity.builder()
                        .referenceId(categoryEntity.getCategoryId())
                        .imageType(ImageType.CATEGORY)
                        .imageUrl(imageUrl)
                        .build())
                .toList();
        return imageEntities.stream().map(imageMapper::toModel).toList();
    }
}
