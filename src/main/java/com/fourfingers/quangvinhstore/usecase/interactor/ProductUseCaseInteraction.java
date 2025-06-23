package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @Override
    @Transactional
    public ListProductOutputData search(SearchProductInputData searchProductInputData,
                                        String sortDirection,
                                        String sortBy,
                                        String pageNumber,
                                        String pageSize) {
        // Create Sort object based on sort direction and field
        Sort sort = Sort.by(sortDirection.equalsIgnoreCase("asc") ?
                        Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy);

        // Create Pageable object with page number, size and sort
        Pageable pageable = PageRequest.of(Integer.parseInt(pageNumber), Integer.parseInt(pageSize), sort);

        // Build specification by combining filter conditions and star rating sort
        Specification<ProductEntity> specification = buildFilter(searchProductInputData).and(buildSortByAvgStarRage());

        // Execute query with specification and pageable, map results to domain model
        List<Product> products = productRepository.findAll(specification, pageable)
                .stream()
                .map(productMapper::toModel)
                .toList();

        // Convert list of products to output data
        return productOutputBoundary.convertToListProductOutputData(products);
    }

    private Specification<ProductEntity> buildFilter(SearchProductInputData searchProductInputData) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.isFalse(root.get("isDiscontinued")));

            if (!CollectionUtils.isEmpty(searchProductInputData.getCategoryIds())) {
                List<UUID> categoryUuids = searchProductInputData.getCategoryIds()
                        .stream()
                        .map(UUID::fromString)
                        .toList();
                predicates.add(root
                        .get("category")
                        .get("categoryId")
                        .in(categoryUuids));
            }

            if (!CollectionUtils.isEmpty(searchProductInputData.getBrandIds())) {
                List<UUID> brandUuids = searchProductInputData.getBrandIds()
                        .stream()
                        .map(UUID::fromString)
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

    private Specification<ProductEntity> buildSortByAvgStarRage() {
        return ((root, query, criteriaBuilder) -> {
            Join<ProductEntity, StarRateEntity> productEntityStarRateEntityJoin = root.join("starRates",
                    JoinType.LEFT);
            query.groupBy(root.get("productId"));
            query.orderBy(criteriaBuilder.desc(criteriaBuilder.avg(productEntityStarRateEntityJoin.get("starRate"))));
            return criteriaBuilder.conjunction();
        });
    }
}