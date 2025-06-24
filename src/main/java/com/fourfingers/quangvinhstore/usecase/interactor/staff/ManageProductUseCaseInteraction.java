package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.usecase.boundary.BackBlazeBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductUseCaseInteraction implements ProductManagementInputBoundary {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final BackBlazeBoundary backBlazeBoundary;
    private final ProductVariantMapper productVariantMapper;
    private final ProductOutputBoundary productOutputBoundary;

    @Override
    @Transactional
    public ProductOutputData save(ProductInputData productInputData, UserDetails userDetails) {
        AccountEntity performInsertingAccount = (AccountEntity) userDetails;
        List<ProductVariantEntity> productVariantEntities = getListVariant(productInputData,
                performInsertingAccount.getWorkingAt());
        ProductEntity needToCreateProduct = ProductEntity.builder()
                .unitPrice(BigDecimal.valueOf(Double.parseDouble(productInputData.getUnitPrice())))
                .createdAt(LocalDateTime.now())
                .createdBy(performInsertingAccount)
                .productDescription(productInputData.getProductDescription())
                .productName(productInputData.getProductName())
                .productVariants(productVariantEntities)
                .build();
        return productOutputBoundary.convertToProductOutputData(
                productMapper.toModel(productRepository.saveAndFlush(needToCreateProduct))
        );
    }

    private List<ProductVariantEntity> getListVariant(ProductInputData productInputData, StoreEntity storeEntity) {
        return productInputData.getProductVariants().stream()
                .map((productVariant) -> {
                    ProductVariantEntity productVariantEntity = productVariantMapper.toEntity(productVariant);
                    productVariantEntity.setStores(List.of(storeEntity));
                    return productVariantEntity;
                })
                .toList();
    }

    private List<ImageEntity> getListImage(ProductInputData productInputData) {
        return null;
    }

}
