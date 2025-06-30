package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.StarRate;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.StarRateMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StarRateRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductVariantEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;
import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StarRateUseCaseInteraction implements StarRateInputBoundary {
    private final StarRateRepository starRateRepository;
    private final StarRateMapper starRateMapper;
    private final StarRateOutputBoundary starRateOutputBoundary;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    @Override
    @Transactional
    public ListStarRateOutputData getAllStarRateOfProduct(String id, String pageNumber, String pageSize,
                                                          String numberOfStarRate) {
        Pageable pageable = PageRequest.of(Integer.parseInt(pageNumber), Integer.parseInt(pageSize));
        Specification<StarRateEntity> filterByProductId = buildFilterByProductId(id, numberOfStarRate);

        List<StarRate> starRates = starRateRepository.findAll(filterByProductId, pageable).stream()
                .map(starRateEntity -> {
                    StarRate starRate = starRateMapper.toModel(starRateEntity);
                    starRate.setProfileImage(getProfileImage(starRateEntity));
                    starRate.setProfileName(getProfileName(starRateEntity));
                    return starRate;
                })
                .toList();

        return starRateOutputBoundary.convertToListStarRateOutputData(
            starRates);
    }

    private Specification<StarRateEntity> buildFilterByProductId(String productId,String numberOfStarRate) {
        return ((root, query, cb) -> {
            Join<StarRateEntity, ProductVariantEntity> starRateProductVariantJoin = root
                    .join("productVariant");
            Join<ProductVariantEntity, ProductEntity> productJoin = starRateProductVariantJoin
                    .join("product");

            if (numberOfStarRate != null) {
                return cb.and(
                        cb.equal(productJoin.get("productId"), Long.parseLong(productId)),
                        cb.equal(root.get("starRate"), Long.parseLong(numberOfStarRate))
                );
            }

            return cb.equal(productJoin.get("productId"), Long.parseLong(productId));
        });
    }

    private Image getProfileImage(StarRateEntity starRateEntity) {
        return imageMapper.toModel(
                imageRepository.findByReferenceIdAndImageType(starRateEntity
                                .getAccount()
                                .getProfile()
                                .getProfileId(),
                        ImageType.PROFILE).orElseThrow(
                        () -> new RuntimeException("Profile image not found")
                )
        );
    }

    private String getProfileName(StarRateEntity starRateEntity) {
        return starRateEntity.getAccount().getProfile().getFirstName() + " " +
                starRateEntity.getAccount().getProfile().getLastName();
    }
}
