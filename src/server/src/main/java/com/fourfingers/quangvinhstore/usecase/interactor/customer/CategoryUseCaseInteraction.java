package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Category;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.CategoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CategoryInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CategoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCategoryOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CategoryUseCaseInteraction implements CategoryInputBoundary {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final CategoryOutputBoundary categoryOutputBoundary;
    @Override
    public ListCategoryOutputData getAll() {
        return categoryOutputBoundary.convertToListCategoryOutputData(
            categoryRepository.findAll()
                    .stream()
                    .map(categoryEntity -> {
                        Category category = categoryMapper.toModel(categoryEntity);
                        category.setImages(
                                imageRepository.findAllByReferenceIdAndImageType(categoryEntity.getCategoryId(),
                                        ImageType.CATEGORY)
                                        .stream()
                                        .map(imageMapper::toModel)
                                        .toList()
                        );
                        return category;
                    })
                    .toList()
        );
    }
}
