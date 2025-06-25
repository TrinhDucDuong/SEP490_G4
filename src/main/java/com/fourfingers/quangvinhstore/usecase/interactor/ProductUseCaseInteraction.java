package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Color;
import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductDetailsOutputData;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

        Specification<ProductEntity> specification = buildFilter(searchProductInputData);
        // Build specification by combining filter conditions and star rating sort
        if(sortBy.equalsIgnoreCase("starRateAvg")) {
            specification = specification.and(buildSortByAvgStarRage(sortDirection));
        } else if(sortBy.equalsIgnoreCase("unitPrice")) {
            specification = specification.and(buildSortByUnitPrice(sortDirection));
        } else if(sortBy.equalsIgnoreCase("createdAt")) {
            specification = specification.and(buildSortByCreatedAt());
        } else if(sortBy.equalsIgnoreCase("numberOfSoldOut")) {
            specification = specification.and(buildSortByNumberOfSoldOut());
        }

        // Execute a query with specification and pageable, map results to a domain model
        List<Product> products = productRepository.findAll(specification, pageable)
                .stream()
                .map(this::getProductInformation)
                .toList();

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

    private Specification<ProductEntity> buildFilter(SearchProductInputData searchProductInputData) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.isTrue(root.get("isActive")));

            if (!CollectionUtils.isEmpty(searchProductInputData.getCategoryIds())) {
                List<Long> categoryUuids = searchProductInputData.getCategoryIds()
                        .stream()
                        .map(Long::parseLong)
                        .toList();
                predicates.add(root
                        .get("category")
                        .get("categoryId")
                        .in(categoryUuids));
            }

            if (!CollectionUtils.isEmpty(searchProductInputData.getBrandIds())) {
                List<Long> brandUuids = searchProductInputData.getBrandIds()
                        .stream()
                        .map(Long::parseLong)
                        .toList();
                predicates.add(root
                        .get("brand")
                        .get("brandId")
                        .in(brandUuids));
            }

            if (!CollectionUtils.isEmpty(searchProductInputData.getProductSizes())) {
                Join<ProductEntity, ProductVariantEntity> variantJoin = root
                        .join("productVariants");
                predicates.add(variantJoin
                        .get("productSize")
                        .in(searchProductInputData.getProductSizes()));

            }

            if (!CollectionUtils.isEmpty(searchProductInputData.getColorHexes())) {
                Join<ProductEntity, ProductVariantEntity> variantJoin = root
                        .join("productVariants");
                predicates.add(variantJoin
                        .get("color")
                        .get("colorHex")
                        .in(searchProductInputData.getColorHexes()));
            }

            if (searchProductInputData.getPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("unitPrice"),
                        searchProductInputData.getPrice()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Specification<ProductEntity> buildSortByAvgStarRage(String sortDirection) {
        return ((root, query, criteriaBuilder) -> {
            Join<ProductEntity, ProductVariantEntity> productEntityProductVariantEntityJoin = root.join(
                    "productVariants",
                    JoinType.LEFT);
            Join<ProductVariantEntity, StarRateEntity> productEntityStarRateEntityJoin =
                    productEntityProductVariantEntityJoin.join("starRates");
            query.groupBy(root.get("productId"));
            query = sortDirection.equalsIgnoreCase("asc") ?
                    query.orderBy(criteriaBuilder.asc(criteriaBuilder.avg(
                            productEntityStarRateEntityJoin.get("starRate")))) :
                    query.orderBy(criteriaBuilder.desc(criteriaBuilder.avg(
                            productEntityStarRateEntityJoin.get("starRate"))));
            return criteriaBuilder.conjunction();
        });
    }

    private Specification<ProductEntity> buildSortByUnitPrice(String sortDirection) {
        return ((root, query, criteriaBuilder) -> {
            query = sortDirection.equalsIgnoreCase("asc") ?
                    query.orderBy(criteriaBuilder.asc(root.get("unitPrice"))) :
                    query.orderBy(criteriaBuilder.desc(root.get("unitPrice")));
            return criteriaBuilder.conjunction();
        });
    }

    private Specification<ProductEntity> buildSortByCreatedAt() {
        return ((root, query, criteriaBuilder) -> {
            query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
            return criteriaBuilder.conjunction();
        });
    }

    private Specification<ProductEntity> buildSortByNumberOfSoldOut() {
        return ((root, query, criteriaBuilder) -> {
            Join<ProductEntity, ProductVariantEntity> variantJoin = root.join("productVariants",
                    JoinType.LEFT);
            Join<ProductVariantEntity, OrderDetailsEntity> orderDetailJoin = variantJoin.join("orderDetails",
                    JoinType.LEFT);

            query.groupBy(root.get("productId"));
            query.orderBy(criteriaBuilder.desc(criteriaBuilder.sum(orderDetailJoin.get("quantity"))));

            return criteriaBuilder.conjunction();
        });
    }
    
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
    
    private List<String> getProductSizes(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .map(productVariantEntity -> {
                    return productVariantEntity.getProductSize().toString();
                })
                .toList();
    }

    private List<Color> getProductColors(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .map(productVariantEntity -> {
                    return Color.builder()
                            .colorHex(productVariantEntity.getColor().getColorHex())
                            .build();
                })
                .toList();
    }
}