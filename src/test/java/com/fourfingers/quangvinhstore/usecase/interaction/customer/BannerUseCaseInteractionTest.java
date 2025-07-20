package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.BannerOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.BannerUseCaseInteraction;
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
public class BannerUseCaseInteractionTest {
    @InjectMocks
    private BannerUseCaseInteraction useCase;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private ImageMapper imageMapper;

    @Mock
    private BannerOutputBoundary outputBoundary;

    private ImageEntity mockImageEntity;
    private Image mockImage;

    @BeforeEach
    public void setUp() {
        mockImageEntity = ImageEntity.builder().imageId(1L)
                .imageType(ImageType.BANNER)
                .imageUrl("example/url")
                .isActive(true)
                .build();

        mockImage = Image.builder()
                .imageUrl("example/url")
                .build();
    }

    @Test
    public void testGetBanner_ShouldReturnBanner() {
        when(imageRepository.findAllByImageType(any())).thenReturn(List.of(mockImageEntity));
        when(imageMapper.toModel(any())).thenReturn(mockImage);
        when(outputBoundary.convertToBannerOutputData(any())).thenReturn(
                new BannerOutputData(List.of(mockImage))
        );

        BannerOutputData actualResult = useCase.getAll();

        assert (actualResult != null);
        assertEquals(1, actualResult.getBannerImages().size());
        assertEquals("example/url", actualResult.getBannerImages().getFirst().getImageUrl());
        verify(imageMapper, times(1)).toModel(mockImageEntity);
        verify(outputBoundary, times(1)).convertToBannerOutputData(List.of(mockImage));
    }

}
