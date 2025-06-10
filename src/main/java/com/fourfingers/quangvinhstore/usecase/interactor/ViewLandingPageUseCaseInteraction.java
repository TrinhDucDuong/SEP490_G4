package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductWithStarRate;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewLandingPageUseCaseInteraction implements LandingPageInputBoundary {
    private final ProductRepository productRepository;
    private final LandingPageOutputBoundary landingPageOutputBoundary;
    private final ProductMapper productMapper;
    @Override
    @Transactional
    public LandingPageOutputData showLandingPage() {
        Pageable pageable = PageRequest.of(0, 10);
        List<ProductWithStarRate> productWithStarRates = productRepository.findTop10ProductWithHighestStarRate(pageable)
                .stream()
                .map(productEntity -> {
                    Double avgStarRate = productEntity.getStarRates()
                            .stream()
                            .mapToLong(StarRateEntity::getStarRate)
                            .average()
                            .orElse(0.0);
                    return new ProductWithStarRate(productMapper.toModel(productEntity), avgStarRate);
                })
                .toList();
        List<Product> products = List.of(
                productRepository.findAll()
                        .stream()
                        .map(productMapper::toModel)
                        .toArray(Product[]::new)
        );
        return landingPageOutputBoundary.convertToLandingPageOutputData(products, productWithStarRates);
    }
}
