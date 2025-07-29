package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.RecommendationUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class RecommendationUseCaseInteractionTest {

    @Mock private GenAiUtilBoundary genAiUtilBoundary;
    @Mock private ProductRepository productRepository;
    @Mock private ActionLogRepository actionLogRepository;
    @Mock private ProductOutputBoundary productOutputBoundary;
    @Mock private ProductMapper productMapper;
    @Mock private ImageRepository imageRepository;
    @Mock private AccountRepository accountRepository;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private RecommendationUseCaseInteraction useCase;

    private AccountEntity mockAccount;
    private ProductEntity mockProductEntity;
    private Product mockProduct;
    private ImageEntity mockImageEntity;
    private Image mockImage;
    @Mock
    private ImageMapper imageMapper;

    @BeforeEach
    void setUp() {
        mockAccount = AccountEntity.builder()
                .accountId(1L)
                .recommendedProduct("[1,2,3]")
                .build();

        mockProductEntity = ProductEntity.builder()
                .productId(1L)
                .productName("Test Shirt")
                .productDescription("Nice shirt")
                .unitPrice(BigDecimal.valueOf(100000L))
                .isActive(true)
                .build();

        mockProduct = new Product();
        mockProduct.setProductId(1L);

        mockImageEntity = ImageEntity.builder()
                .isActive(true)
                .imageUrl("example/url")
                .referenceId(1L)
                .imageType(ImageType.PRODUCT)
                .build();

        mockImage = Image.builder()
                .imageUrl("example/url")
                .build();

        userDetails = (UserDetails) mockAccount;
    }

    @Test
    void testGetRecommendation_withExistingRecommendations_shouldReturnMappedProducts() {
        mockAccount.setRecommendedProduct("[1]");
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(mockProductEntity));
        when(productMapper.toModel(any())).thenReturn(mockProduct);
        when(imageRepository.findAllByReferenceIdAndImageType(anyLong(), eq(ImageType.PRODUCT)))
                .thenReturn(List.of(mockImageEntity));
        when(imageMapper.toModel(any())).thenReturn(mockImage);
        when(productOutputBoundary.convertToListProductOutputData(any()))
                .thenReturn(new ListProductOutputData());

        ListProductOutputData result = useCase.getRecommendation(userDetails);
        assertNotNull(result);
    }



    @Test
    void testGetRecommendation_withNullRecommendations_shouldFallbackToPage() {
        mockAccount.setRecommendedProduct(null);

        Pageable pageable = PageRequest.of(0, 15);
        Page<ProductEntity> mockPage = new PageImpl<>(List.of(mockProductEntity));

        when(productRepository.findAll(pageable)).thenReturn(mockPage);
        when(productMapper.toModel(any())).thenReturn(mockProduct);
        when(productOutputBoundary.convertToListProductOutputData(any())).thenReturn(new ListProductOutputData());

        ListProductOutputData result = useCase.getRecommendation(userDetails);
        assertNotNull(result);
    }


    @Test
    void testSaveRecommendation_shouldUpdateAccount() {
        when(actionLogRepository.findTop20ActionLogEntitiesByPerformerIdOrderByActionTimeDesc(anyLong())).thenReturn(List.of());
        when(productRepository.findAll()).thenReturn(List.of(mockProductEntity));
        when(genAiUtilBoundary.getRecommendation(any(), any())).thenReturn("[1,2,3]");

        useCase.saveRecommendation(userDetails);
        verify(accountRepository).save(any(AccountEntity.class));
    }

    @Test
    void testGetRecommendation_withInvalidProductId_shouldSkipNullProducts() {
        mockAccount.setRecommendedProduct("[999]"); // non-existent product
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(productOutputBoundary.convertToListProductOutputData(any()))
                .thenReturn(new ListProductOutputData());

        ListProductOutputData result = useCase.getRecommendation(userDetails);
        assertNotNull(result);
    }
}
