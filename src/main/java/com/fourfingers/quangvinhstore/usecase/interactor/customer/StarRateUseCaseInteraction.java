package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.StarRateMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StarRateRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StarRateUseCaseInteraction implements StarRateInputBoundary {
    private final StarRateRepository starRateRepository;
    private final StarRateMapper starRateMapper;
    private final StarRateOutputBoundary starRateOutputBoundary;
    @Override
    public ListStarRateOutputData getAllStarRateOfProduct(String id, String pageNumber, String pageSize) {
        Pageable pageable = PageRequest.of(Integer.parseInt(pageNumber), Integer.parseInt(pageSize));
        Specification<StarRateEntity> filterByProductId = buildFilterByProductId(id);
        return starRateOutputBoundary.convertToListStarRateOutputData(
            starRateRepository.findAll(filterByProductId, pageable)
                    .stream()
                    .map(starRateMapper::toModel)
                    .toList()
        );
    }

    private Specification<StarRateEntity> buildFilterByProductId(String productId) {
        return ((root, query, cb) ->  {
            Join<StarRateEntity, ProductVariantEntity> starRateProductVariantJoin = root
                    .join("productVariant");
            Join<ProductVariantEntity, ProductEntity> productJoin = starRateProductVariantJoin
                    .join("product");
            return cb.equal(productJoin.get("productId"), Long.parseLong(productId));
        });
    }
}
