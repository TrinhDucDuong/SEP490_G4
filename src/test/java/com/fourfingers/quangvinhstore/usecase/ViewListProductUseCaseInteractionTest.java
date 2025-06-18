package com.fourfingers.quangvinhstore.usecase;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductImage;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductImageEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.ViewListProductUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class ViewListProductUseCaseInteractionTest {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private ProductOutputBoundary productOutputBoundary;

    @Mock
    private ProductImageMapper productImageMapper;

    @InjectMocks
    private ViewListProductUseCaseInteraction viewListProductUseCaseInteraction;

    private Product mockProduct;
    private ProductEntity mockProductEntity;
    private ProductImageEntity mockProductImageEntity;
    private ProductImage mockProductImage;
    private ListProductOutputData mockListProductOutputData;


    @BeforeEach
    void setUp() {
        mockProduct = new Product();
        mockProductEntity = new ProductEntity();
        mockProductImageEntity = new ProductImageEntity();
        mockProductImage = new ProductImage();
        mockListProductOutputData = new ListProductOutputData();
        mockProductEntity.setProductImages(List.of(mockProductImageEntity));
    }

    @Test
    public void testGetListProductSuccess() {
        when(productRepository.findAllByIsActiveTrue()).thenReturn(List.of(mockProductEntity));
        when(productMapper.toModel(mockProductEntity)).thenReturn(mockProduct);
        when(productImageMapper.toModel(mockProductImageEntity)).thenReturn(mockProductImage);
        when(productOutputBoundary.convertToListProductOutputData(anyList())).thenReturn(mockListProductOutputData);

        ListProductOutputData result = viewListProductUseCaseInteraction.getListProduct();
        assertNotNull(result);
        assertEquals(mockListProductOutputData, result);
        verify(productRepository).findAllByIsActiveTrue();
        verify(productMapper).toModel(mockProductEntity);
        verify(productImageMapper).toModel(mockProductImageEntity);
        verify(productOutputBoundary).convertToListProductOutputData(anyList());
    }
}
