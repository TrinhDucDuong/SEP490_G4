//package com.fourfingers.quangvinhstore.usecase;
//
//import com.fourfingers.quangvinhstore.domain.model.customer.Product;
//import com.fourfingers.quangvinhstore.domain.model.ProductImage;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductImageMapper;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
//import com.fourfingers.quangvinhstore.infrastructure.schema.ProductImageEntity;
//import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.ViewLandingPageUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.util.List;
//
//import static org.mockito.Mockito.*;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.anyList;
//
//@SpringBootTest
//@ActiveProfiles("test")
//public class ViewLandingPageUesCaseInteractionTest {
//    @Mock
//    private ProductRepository productRepository;
//
//    @Mock
//    private LandingPageOutputBoundary landingPageOutputBoundary;
//
//    @Mock
//    private ProductMapper productMapper;
//
//    @Mock
//    private ProductImageMapper productImageMapper;
//
//    @InjectMocks
//    private ViewLandingPageUseCaseInteraction viewLandingPageUseCaseInteraction;
//
//    private Product mockProduct;
//    private ProductEntity mockProductEntity;
//    private ProductImageEntity mockProductImageEntity;
//    private ProductImage mockProductImage;
//    private Pageable mockPageable;
//    private LandingPageOutputData mockLandingPageOutputData;
//
//    @BeforeEach
//    void setUp() {
//        mockProduct = new Product();
//        mockProductEntity = new ProductEntity();
//        mockProductImageEntity = new ProductImageEntity();
//        mockProductImage = new ProductImage();
//        mockProductEntity.setProductImages(List.of(mockProductImageEntity));
//        mockPageable = PageRequest.of(0, 10);
//        StarRateEntity mockStarRateEntity = StarRateEntity.builder()
//                .starRate(5L)
//                .build();
//        mockProductEntity.setStarRates(List.of(mockStarRateEntity));
//        mockLandingPageOutputData = new LandingPageOutputData();
//    }
//
//    @Test
//    public void testShowLandingPageStarRateNotNullSuccess() {
//        when(productRepository.findTop10ProductWithHighestStarRate(mockPageable))
//                .thenReturn(List.of(mockProductEntity));
//        when(productMapper.toModel(mockProductEntity)).thenReturn(mockProduct);
//        when(productImageMapper.toModel(mockProductImageEntity)).thenReturn(mockProductImage);
//        when(productRepository.findAll()).thenReturn(List.of(mockProductEntity));
//        when(landingPageOutputBoundary.convertToLandingPageOutputData(anyList(), anyList()))
//                .thenReturn(mockLandingPageOutputData);
//
//        LandingPageOutputData result = viewLandingPageUseCaseInteraction.showLandingPage();
//        assertNotNull(result);
//        assertEquals(mockLandingPageOutputData, result);
//        verify(productRepository).findTop10ProductWithHighestStarRate(mockPageable);
//        verify(productMapper, times(2)).toModel(mockProductEntity);
//        verify(productImageMapper).toModel(mockProductImageEntity);
//        verify(productRepository).findAll();
//    }
//}
