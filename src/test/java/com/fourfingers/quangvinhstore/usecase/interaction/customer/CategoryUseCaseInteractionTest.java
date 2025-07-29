package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Category;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.CategoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.CategoryEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CategoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCategoryOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.CategoryUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class CategoryUseCaseInteractionTest {
    @InjectMocks
    private CategoryUseCaseInteraction useCase;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private ImageMapper imageMapper;

    @Mock
    private CategoryOutputBoundary categoryOutputBoundary;

    private ImageEntity mockImageEntity;
    private Image mockImage;
    private CategoryEntity mockCategoryEntity;
    private Category mockCategory;
    private ListCategoryOutputData mockListCategoryOutputData;

    @BeforeEach
    public void setUp() {
        mockImageEntity = ImageEntity.builder()
                .isActive(true)
                .imageUrl("example/url")
                .referenceId(1L)
                .imageType(ImageType.CATEGORY)
                .build();

        mockImage = Image.builder()
                .imageUrl("example/url")
                .build();

        mockCategoryEntity = CategoryEntity.builder()
                .categoryId(1L)
                .categoryName("Long's Category")
                .build();

        mockCategory = Category.builder()
                .categoryId(1L)
                .categoryName("Long's Category")
                .images(List.of(mockImage))
                .build();

        mockListCategoryOutputData = new ListCategoryOutputData(List.of(mockCategory));
    }

    @Test
    public void testGetAll_ShouldReturnExpectedOutput() {
        when(categoryRepository.findAll()).thenReturn(List.of(mockCategoryEntity));
        when(categoryMapper.toModel(any())).thenReturn(mockCategory);

        when(imageRepository.findAllByReferenceIdAndImageType(any(), any())).thenReturn(List.of(mockImageEntity));
        when(imageMapper.toModel(any())).thenReturn(mockImage);
        when(categoryOutputBoundary.convertToListCategoryOutputData(any())).thenReturn(mockListCategoryOutputData);

        ListCategoryOutputData actualResult = useCase.getAll();

        assertEquals(1, actualResult.getCategoryList().size());
        assertEquals("Long's Category", actualResult.getCategoryList().getFirst().getCategoryName());
        assertEquals(1L, actualResult.getCategoryList().getFirst().getCategoryId());

        verify(categoryRepository, times(1)).findAll();
        verify(categoryMapper, times(1)).toModel(mockCategoryEntity);
        verify(imageRepository, times(1))
                .findAllByReferenceIdAndImageType(1L, ImageType.CATEGORY);
        verify(imageMapper, times(1)).toModel(mockImageEntity);
    }
}
