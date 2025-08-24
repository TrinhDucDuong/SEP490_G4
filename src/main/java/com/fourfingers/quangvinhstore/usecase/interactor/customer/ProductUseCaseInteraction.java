package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.ProductVariant;
import com.fourfingers.quangvinhstore.domain.model.customer.*;
import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.BrandMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.CategoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductDetailsOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Product use case interaction implementation that handles product-related business logic
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProductUseCaseInteraction implements ProductInputBoundary {
    private final ProductOutputBoundary productOutputBoundary;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final BrandMapper brandMapper;
    private final CategoryMapper categoryMapper;
    private final ProductVariantMapper productVariantMapper;

    /**
     * Search for products based on given criteria
     *
     * @param searchProductInputData Contains search criteria like price range, categories, brands etc
     * @param sortDirection          The direction to sort results (asc/desc)
     * @param sortBy                 The field to sort results by
     * @param pageNumber             The page number for pagination
     * @param pageSize               The number of items per page
     * @return ListProductOutputData containing the search results
     */
    @Override
    @Transactional
    public ListProductOutputData search(SearchProductInputData searchProductInputData,
                                        String sortDirection,
                                        String sortBy,
                                        String pageNumber,
                                        String pageSize
    ) {
        // Create a Pageable object with page number, size and sort
        Pageable pageable = PageRequest.of(Integer.parseInt(pageNumber), Integer.parseInt(pageSize));

        String categoryIds = searchProductInputData.getCategoryIds() != null
                ? String.join(",", searchProductInputData.getCategoryIds())
                : null;

        String brandIds = searchProductInputData.getBrandIds() != null
                ? String.join(",", searchProductInputData.getBrandIds())
                : null;

        String colorHexes = searchProductInputData.getColorHexes() != null
                ? String.join(",", searchProductInputData.getColorHexes())
                : null;

        String productSizes = searchProductInputData.getProductSizes() != null
                ? String.join(",", searchProductInputData.getProductSizes())
                : null;

        List<Product> products = getSearchResult(
                productRepository.searchProduct(
                        searchProductInputData.getMinPrice(), searchProductInputData.getMaxPrice(),
                        categoryIds, brandIds, colorHexes, productSizes,
                        sortDirection, sortBy, searchProductInputData.getSearchText(), pageable
                ).getContent()
        );

        // Convert a list of products to output data
        return productOutputBoundary.convertToListProductOutputData(products);
    }

    /**
     * Get detailed information for a specific product
     *
     * @param id The product ID
     * @return ProductDetailsOutputData containing complete product details
     * @throws RuntimeException if product is not found
     */
    @Override
    @Transactional
    public ProductDetailsOutputData getProduct(String id) {
        Long productId = Long.parseLong(id);
        ProductEntity productEntity = productRepository.findByProductIdAndIsActiveTrue(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        Product product = getProductInformation(productEntity);
        return productOutputBoundary.convertToProductDetailsOutputData(product,
                getProductSizes(productEntity),
                getProductColors(productEntity));
    }

    /**
     * Converts a product entity to product model with all related information
     *
     * @param productEntity The product entity to convert
     * @return Product model with complete information including ratings, images etc
     */
    private Product getProductInformation(ProductEntity productEntity) {
        Product product = productMapper.toModel(productEntity);
        Double starRateAvg = productEntity.getProductVariants().stream()
                .flatMap(variant -> variant.getStarRates().stream())
                .mapToDouble(StarRateEntity::getStarRate)
                .average()
                .orElse(0.0);
        product.setStarRateAvg(starRateAvg);
        List<Image> images = imageRepository.findAllByReferenceIdAndImageType(productEntity.getProductId(),
                ImageType.PRODUCT).stream().map(imageMapper::toModel).toList();
        product.setImages(images);
        Long numberOfSoldOut = numberOfSoldOut(productEntity);
        product.setTotalSoldOut(numberOfSoldOut);
        //Set category
        List<Image> categoryImages = getCategoryImage(productEntity.getCategory());
        Category category = categoryMapper.toModel(productEntity.getCategory());
        category.setImages(categoryImages);
        product.setCategory(category);
        //Set brand
        List<Image> brandImages = getBrandImage(productEntity.getBrand());
        Brand brand = brandMapper.toModel(productEntity.getBrand());
        brand.setImages(brandImages);
        product.setBrand(brand);

        //Set variants
        List<ProductDetailsVariant> productVariants = productEntity.getProductVariants().stream()
                .filter(ProductVariantEntity::getIsActive)
                .map(productVariantEntity -> {
                    return ProductDetailsVariant.builder()
                            .productSize(productVariantEntity.getProductSize().toString())
                            .colorHex(productVariantEntity.getColor().getColorHex())
                            .quantity(productVariantEntity.getQuantity())
                            .build();
                })
                .toList();
        product.setProductVariants(productVariants);

        return product;
    }

    /**
     * Calculate total number of units sold for a product
     *
     * @param productEntity The product entity to calculate sales for
     * @return Total number of units sold
     */
    private Long numberOfSoldOut(ProductEntity productEntity) {
        return productEntity.getProductVariants()
                .stream()
                .flatMap(variant -> variant.getOrderDetails().stream())
                .mapToLong(OrderDetailsEntity::getQuantity)
                .sum();
    }

    /**
     * Get all available sizes for a product
     *
     * @param productEntity The product entity to get sizes from
     * @return List of available size strings
     */
    private List<String> getProductSizes(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .filter(ProductVariantEntity::getIsActive)
                .map(productVariantEntity -> {
                    return productVariantEntity.getProductSize().toString();
                })
                .toList();
    }

    /**
     * Get all available colors for a product
     *
     * @param productEntity The product entity to get colors from
     * @return List of available colors
     */
    private List<Color> getProductColors(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .filter(ProductVariantEntity::getIsActive)
                .map(productVariantEntity -> {
                    return Color.builder()
                            .colorHex(productVariantEntity.getColor().getColorHex())
                            .build();
                })
                .toList();
    }

    /**
     * Convert database search results to product models
     *
     * @param result List of Object arrays containing product data
     * @return List of Product models
     */
    private List<Product> getSearchResult(List<Object[]> result) {
        return result.stream()
                .map(row -> {
                    Product product =  Product.builder()
                            .productId(((Number) row[0]).longValue())
                            .productName((String) row[1])
                            .productDescription((String) row[2])
                            .unitPrice((BigDecimal) row[3])
                            .starRateAvg(((Number) row[4]).doubleValue())
                            .totalSoldOut(((Number) row[5]).longValue())
                            .build();
                    product.setImages(
                            imageRepository.findAllByReferenceIdAndImageType(product.getProductId(),
                                    ImageType.PRODUCT)
                                    .stream()
                                    .map(imageMapper::toModel)
                                    .toList()
                    );
                    product.setCategory(getProductCategory(product.getProductId()));
                    product.setBrand(getProductBrand(product.getProductId()));
                    return product;
                }
                ).toList();
    }

    /**
     * Get all images associated with a category
     *
     * @param categoryEntity The category entity to get images for
     * @return List of category images
     */
    private List<Image> getCategoryImage(CategoryEntity categoryEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(categoryEntity.getCategoryId(), ImageType.CATEGORY)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }

    /**
     * Get all images associated with a brand
     *
     * @param brandEntity The brand entity to get images for
     * @return List of brand images
     */
    private List<Image> getBrandImage(BrandEntity brandEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(brandEntity.getBrandId(), ImageType.BRAND)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }

    /**
     * Get category information for a product
     *
     * @param productId The ID of the product
     * @return Category model for the product
     * @throws RuntimeException if product is not found
     */
    private Category getProductCategory(Long productId) {
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        return categoryMapper.toModel(productEntity.getCategory());
    }

    /**
     * Get brand information for a product
     *
     * @param productId The ID of the product
     * @return Brand model for the product
     * @throws RuntimeException if product is not found
     */
    private Brand getProductBrand(Long productId) {
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        return brandMapper.toModel(productEntity.getBrand());
    }
}