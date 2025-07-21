package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Brand;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.BrandMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BrandRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.BrandEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BrandOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListBrandOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.BrandUseCaseInteraction;
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
public class BrandUseCaseInteractionTest {
    @InjectMocks
    private BrandUseCaseInteraction useCase;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private BrandMapper brandMapper;

    @Mock
    private BrandOutputBoundary outputBoundary;

    @Mock
    private ImageMapper imageMapper;

    @Mock
    private ImageRepository imageRepository;

    private ImageEntity mockImageEntity;
    private Image mockImage;
    private BrandEntity mockBrandEntity;
    private Brand mockBrand;

    @BeforeEach
    public void setUp() {
        mockImageEntity = ImageEntity.builder()
                .isActive(true)
                .imageUrl("example/url")
                .referenceId(1L)
                .imageType(ImageType.BRAND)
                .build();

        mockImage = Image.builder()
                .imageUrl("example/url")
                .build();

        mockBrandEntity = BrandEntity.builder()
                .brandId(1L)
                .brandName("Long's Brand")
                .brandDescription("Long's Brand Description")
                .build();

        mockBrand = Brand.builder()
                .brandId(1L)
                .brandName("Long's Brand")
                .brandDescription("Long's Brand Description")
                .images(List.of(mockImage))
                .build();
    }

    @Test
    void testGetAll_ShouldReturnExpectedOutput() {
        when(brandRepository.findAll()).thenReturn(List.of(mockBrandEntity));
        when(brandMapper.toModel(any())).thenReturn(mockBrand);
        when(imageRepository.findAllByReferenceIdAndImageType(any(), any())).thenReturn(List.of(mockImageEntity));
        when(imageMapper.toModel(any())).thenReturn(mockImage);
        when(outputBoundary.convertToListBrandOutputData(List.of(mockBrand)))
                .thenReturn(new ListBrandOutputData(List.of(mockBrand)));

        ListBrandOutputData expectedResult = new ListBrandOutputData(List.of(mockBrand));

        ListBrandOutputData actualResult = useCase.getAll();

        assertEquals(1, actualResult.getBrands().size());
        assertEquals("Long's Brand", actualResult.getBrands().get(0).getBrandName());
        assertEquals("example/url", actualResult.getBrands().get(0).getImages().get(0).getImageUrl());

        verify(brandRepository, times(1)).findAll();
        verify(brandMapper, times(1)).toModel(mockBrandEntity);
        verify(imageRepository, times(1)).findAllByReferenceIdAndImageType(1L, ImageType.BRAND);
        verify(imageMapper, times(1)).toModel(mockImageEntity);
    }
}
