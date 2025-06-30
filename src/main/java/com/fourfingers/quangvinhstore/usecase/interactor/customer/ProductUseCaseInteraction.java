package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Color;
import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductDetailsOutputData;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProductUseCaseInteraction implements ProductInputBoundary {
    private final ProductOutputBoundary productOutputBoundary;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final ProductVariantMapper productVariantMapper;

    @Override
    @Transactional
    public ListProductOutputData search(SearchProductInputData searchProductInputData,
                                        String sortDirection,
                                        String sortBy,
                                        String pageNumber,
                                        String pageSize) {
        // Create a Pageable object with page number, size and sort
        Pageable pageable = PageRequest.of(Integer.parseInt(pageNumber), Integer.parseInt(pageSize));

        List<Product> products = getSearchResult(
                productRepository.searchProduct(
                        searchProductInputData.getMinPrice(), searchProductInputData.getMaxPrice(),
                        searchProductInputData.getCategoryIds(), searchProductInputData.getBrandIds(),
                        searchProductInputData.getColorHexes(), searchProductInputData.getProductSizes(),
                        sortDirection, sortBy, pageable
                ).getContent()
        );

        // Convert a list of products to output data
        return productOutputBoundary.convertToListProductOutputData(products);
    }

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
    /*
    *   Get total sold out of a product
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
        return product;
    }


    //Get the number of products sold out
    private Long numberOfSoldOut(ProductEntity productEntity) {
        return productEntity.getProductVariants()
                .stream()
                .flatMap(variant -> variant.getOrderDetails().stream())
                .mapToLong(OrderDetailsEntity::getQuantity)
                .sum();
    }

    /*
    * Get product size
    */
    private List<String> getProductSizes(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .map(productVariantEntity -> {
                    return productVariantEntity.getProductSize().toString();
                })
                .toList();
    }

    /*
    * Get product colors
    */
    private List<Color> getProductColors(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .map(productVariantEntity -> {
                    return Color.builder()
                            .colorHex(productVariantEntity.getColor().getColorHex())
                            .build();
                })
                .toList();
    }

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
                    return product;
                }
                ).toList();
    }
}