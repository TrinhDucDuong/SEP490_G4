package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.OrderByClause;
import com.fourfingers.quangvinhstore.usecase.data.input.product.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.input.product.SortDirection;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ListProductOutputData search(SearchProductInputData searchProductInputData) {
        Specification<ProductEntity> specification = (root, query, combine) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(combine.isFalse(root.get("isDiscontinued")));

            if(!CollectionUtils.isEmpty(searchProductInputData.getCategoryIds())) {
                List<UUID> categoryUuids = searchProductInputData.getCategoryIds()
                        .stream()
                        .map(UUID::fromString)
                        .toList();
                predicates.add(root
                        .get("category")
                        .get("categoryId")
                        .in(categoryUuids));
            }

            if(!CollectionUtils.isEmpty(searchProductInputData.getBrandIds())) {
                List<UUID> brandUuids = searchProductInputData.getBrandIds()
                        .stream()
                        .map(UUID::fromString)
                        .toList();
                predicates.add(root
                        .get("brand")
                        .get("brandId")
                        .in(brandUuids));
            }

            if(!CollectionUtils.isEmpty(searchProductInputData.getProductSizes())) {
                Join<ProductEntity, ProductVariantEntity> variantJoin = root
                        .join("productVariants");
                predicates.add(variantJoin
                        .get("productSize")
                        .in(searchProductInputData.getProductSizes()));

            }

            if(!CollectionUtils.isEmpty(searchProductInputData.getColorHexes())) {
                Join<ProductEntity, ProductVariantEntity> variantJoin = root
                        .join("productVariants");
                predicates.add(variantJoin
                        .get("color")
                        .get("colorHex")
                        .in(searchProductInputData.getColorHexes()));
            }

            if(searchProductInputData.getPrice() != null) {
                predicates.add(combine.lessThanOrEqualTo(root.get("unitPrice"),
                        searchProductInputData.getPrice()));
            }

            if(!CollectionUtils.isEmpty(searchProductInputData.getOrderByClauses())) {
                List<Order> orders = new ArrayList<>();
                for(OrderByClause orderByClause : searchProductInputData.getOrderByClauses()) {
                    Path<?> path = root.get(orderByClause.getField());
                    Order order = orderByClause.getDirection() == SortDirection.ASC ?
                            combine.asc(path) : combine.desc(path);
                    orders.add(order);
                }
                query.orderBy(orders);
            }

            return combine.and(predicates.toArray(new Predicate[0]));
        };

        List<Product> products = productRepository.findAll(specification)
                .stream()
                .map(productMapper::toModel)
                .toList();
        return productOutputBoundary.convertToListProductOutputData(products);
    }
}
