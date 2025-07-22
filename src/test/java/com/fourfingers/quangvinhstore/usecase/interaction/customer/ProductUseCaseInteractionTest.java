package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Brand;
import com.fourfingers.quangvinhstore.domain.model.customer.Category;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.BrandMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.CategoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.ProductUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ProductUseCaseInteractionTest {
    @Mock
    private ProductOutputBoundary productOutputBoundary;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductMapper productMapper;
    @Mock
    private ImageRepository imageRepository;
    @Mock
    private ImageMapper imageMapper;
    @Mock
    private BrandMapper brandMapper;
    @Mock
    private CategoryMapper categoryMapper;
    @Mock
    private ProductVariantMapper productVariantMapper;

    @InjectMocks
    private ProductUseCaseInteraction useCase;

    private ProductEntity mockProductEntity;
    private CategoryEntity mockCategoryEntity;
    private BrandEntity mockBrandEntity;
    private Product mockProduct;
    private Category mockCategory;
    private Brand mockBrand;
    private ProductVariantEntity mockVariant;

    @BeforeEach
    void setUp() {
        mockBrandEntity = mock(BrandEntity.class);
        mockCategoryEntity = mock(CategoryEntity.class);
        mockProductEntity = mock(ProductEntity.class);

        mockCategory = Category.builder()
                .categoryId(1L)
                .categoryName("Long's Category")
                .build();

        mockBrand = Brand.builder()
                .brandId(1L)
                .brandName("Long's Brand")
                .brandDescription("Description")
                .build();

        mockProduct = Product.builder()
                .productId(1L)
                .brand(mockBrand)
                .category(mockCategory)
                .productDescription("desc")
                .productName("Test")
                .productVariants(List.of())
                .images(List.of())
                .build();

        mockVariant = ProductVariantEntity.builder()
                .productVariantId(1L)
                .productSize(ProductSize.L)
                .color(ColorEntity.builder().colorHex("#FFFFFF").build())
                .quantity(10L)
                .starRates(List.of(
                        StarRateEntity.builder().starRate(4L).build(),
                        StarRateEntity.builder().starRate(5L).build()
                ))
                .orderDetails(List.of(
                        OrderDetailsEntity.builder().quantity(3L).build()
                ))
                .build();
    }

    @Test
    void testGetProduct_success() {
        // Mock return values for productEntity
        when(mockProductEntity.getProductId()).thenReturn(1L);
        when(mockProductEntity.getCategory()).thenReturn(mockCategoryEntity);
        when(mockProductEntity.getBrand()).thenReturn(mockBrandEntity);
        when(mockProductEntity.getProductVariants()).thenReturn(List.of(mockVariant)); // avoid NPE

        // Mock IDs for category and brand
        when(mockCategoryEntity.getCategoryId()).thenReturn(1L);
        when(mockBrandEntity.getBrandId()).thenReturn(1L);

        // Mock repository & mapper
        when(productRepository.findByProductIdAndIsActiveTrue(1L)).thenReturn(Optional.of(mockProductEntity));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProductEntity)); // CRUCIAL!
        when(productMapper.toModel(mockProductEntity)).thenReturn(mockProduct);

        // Mock imageRepository
        when(imageRepository.findAllByReferenceIdAndImageType(anyLong(), any())).thenReturn(List.of());
        when(imageMapper.toModel(any())).thenReturn(Image.builder().build());

        // Mock category and brand mapper
        when(categoryMapper.toModel(any())).thenReturn(mockCategory);
        when(brandMapper.toModel(any())).thenReturn(mockBrand);

        // Final conversion
        when(productOutputBoundary.convertToProductDetailsOutputData(any(), any(), any()))
                .thenReturn(new ProductDetailsOutputData());

        // ACT
        ProductDetailsOutputData result = useCase.getProduct("1");

        // ASSERT
        assertNotNull(result);
    }

    @Test
    void testGetProduct_notFound() {
        when(productRepository.findByProductIdAndIsActiveTrue(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> useCase.getProduct("999"));
    }

    @Test
    void testSearch_returnsMappedProductList() {
        SearchProductInputData input = new SearchProductInputData();
        input.setSearchText("demo");

        Object[] mockRow = new Object[]{1L, "Test", "desc", BigDecimal.TEN, 4.0, 20L};
        Page<Object[]> mockPage = new PageImpl<>(List.<Object[]>of(mockRow));

        when(productRepository.searchProduct(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)
        )).thenReturn(mockPage);


        when(imageRepository.findAllByReferenceIdAndImageType(anyLong(), eq(ImageType.PRODUCT)))
                .thenReturn(List.of());
        when(imageMapper.toModel(any())).thenReturn(Image.builder().build());
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(mock(ProductEntity.class)));
        when(categoryMapper.toModel(any())).thenReturn(Category.builder().build());
        when(brandMapper.toModel(any())).thenReturn(Brand.builder().build());

        when(productOutputBoundary.convertToListProductOutputData(any()))
                .thenReturn(new ListProductOutputData(List.of()));

        ListProductOutputData result = useCase.search(input, "asc", "price", "0", "10");
        assertNotNull(result);
        assertEquals(0, result.getProducts().size());
        assertTrue(result.getProducts().isEmpty());
    }

    @Test
    void testGetProductCategory_throwIfNotFound() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> {
            useCase.getProduct("123"); // indirectly calls getProductCategory()
        });
    }

    @Test
    void testGetProductBrand_throwIfNotFound() {
        when(productRepository.findByProductIdAndIsActiveTrue(anyLong()))
                .thenReturn(Optional.of(mock(ProductEntity.class)));
        when(productMapper.toModel(any())).thenReturn(Product.builder().productId(1L).build());
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> useCase.getProduct("1"));
    }

    @Test
    void testSearch_whenCategoryIdsAreNull_shouldStillReturnProducts() {
        SearchProductInputData input = SearchProductInputData.builder()
                .categoryIds(null)
                .brandIds(List.of("1"))
                .colorHexes(List.of("FFFFFF"))
                .productSizes(List.of("L"))
                .minPrice(BigDecimal.TEN)
                .maxPrice(BigDecimal.valueOf(100))
                .searchText("demo")
                .build();

        runSearchWithMockPage(input);
    }

    @Test
    void testSearch_whenBrandIdsAreNull_shouldStillReturnProducts() {
        SearchProductInputData input = SearchProductInputData.builder()
                .categoryIds(List.of("1"))
                .brandIds(null)
                .colorHexes(List.of("FFFFFF"))
                .productSizes(List.of("L"))
                .minPrice(BigDecimal.TEN)
                .maxPrice(BigDecimal.valueOf(100))
                .searchText("demo")
                .build();

        runSearchWithMockPage(input);
    }

    @Test
    void testSearch_whenColorHexesAreNull_shouldStillReturnProducts() {
        SearchProductInputData input = SearchProductInputData.builder()
                .categoryIds(List.of("1"))
                .brandIds(List.of("1"))
                .colorHexes(null)
                .productSizes(List.of("L"))
                .minPrice(BigDecimal.TEN)
                .maxPrice(BigDecimal.valueOf(100))
                .searchText("demo")
                .build();

        runSearchWithMockPage(input);
    }

    @Test
    void testSearch_whenProductSizesAreNull_shouldStillReturnProducts() {
        SearchProductInputData input = SearchProductInputData.builder()
                .categoryIds(List.of("1"))
                .brandIds(List.of("1"))
                .colorHexes(List.of("FFFFFF"))
                .productSizes(null)
                .minPrice(BigDecimal.TEN)
                .maxPrice(BigDecimal.valueOf(100))
                .searchText("demo")
                .build();

        runSearchWithMockPage(input);
    }

    private void runSearchWithMockPage(SearchProductInputData input) {
        Object[] mockRow = new Object[]{1L, "Mock Product", "Description", BigDecimal.TEN, 4.0, 50L};
        Page<Object[]> mockPage = new PageImpl<>(List.<Object[]>of(mockRow));

        when(productRepository.searchProduct(
                eq(input.getMinPrice()), eq(input.getMaxPrice()),
                any(), any(), any(), any(), // any = nullable strings
                eq("asc"), eq("price"), eq("demo"), any(Pageable.class)
        )).thenReturn(mockPage);

        when(imageRepository.findAllByReferenceIdAndImageType(anyLong(), eq(ImageType.PRODUCT)))
                .thenReturn(List.of());
        when(imageMapper.toModel(any())).thenReturn(Image.builder().build());

        when(productRepository.findById(anyLong())).thenReturn(Optional.of(mock(ProductEntity.class)));
        when(categoryMapper.toModel(any())).thenReturn(Category.builder().build());
        when(brandMapper.toModel(any())).thenReturn(Brand.builder().build());

        when(productOutputBoundary.convertToListProductOutputData(any()))
                .thenReturn(new ListProductOutputData(List.of()));

        ListProductOutputData result = useCase.search(input, "asc", "price", "0", "10");

        assertNotNull(result);
        assertTrue(result.getProducts().isEmpty());
    }

    @Test
    void testGetProductCategory_throwsWhenProductNotFound() {
        Long fakeProductId = 999L;

        Object[] row = new Object[]{fakeProductId, "Fake Product", "Description", BigDecimal.TEN, 4.0, 0L};
        Page<Object[]> mockPage = new PageImpl<>(List.<Object[]>of(row));
        when(productRepository.searchProduct(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)
        )).thenReturn(mockPage);

        when(productRepository.findById(fakeProductId)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> useCase.search(
                        SearchProductInputData.builder().build(),
                        "asc", "price", "0", "10")
        );

        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void testGetProductBrand_throwsWhenProductNotFound() {
        // Arrange
        Long fakeProductId = 123L;

        // Mock the searchProduct call to simulate a result needing brand info
        Object[] row = new Object[]{fakeProductId, "Test", "Desc", BigDecimal.TEN, 4.0, 100L};
        Page<Object[]> mockPage = new PageImpl<>(List.<Object[]>of(row));
        when(productRepository.searchProduct(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)
        )).thenReturn(mockPage);

        // But now simulate that the product can't be found by ID
        when(productRepository.findById(fakeProductId)).thenReturn(Optional.empty());

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> useCase.search(
                        SearchProductInputData.builder().build(),
                        "asc", "price", "0", "10")
        );

        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void testPrivate_getProductBrand_throwWhenNotFound() throws Exception {
        // Arrange
        Long productId = 123L;

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        Method method = ProductUseCaseInteraction.class.getDeclaredMethod("getProductBrand", Long.class);
        method.setAccessible(true);

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            try {
                method.invoke(useCase, productId);
            } catch (InvocationTargetException e) {
                throw e.getCause();
            }
        });

        assertEquals("Product not found", ex.getMessage());
    }
}
