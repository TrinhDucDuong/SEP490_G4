package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductVariantMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.usecase.boundary.BackBlazeBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductUseCaseInteraction implements ProductManagementInputBoundary {
    private ProductRepository productRepository;
    private ProductMapper productMapper;
    private BackBlazeBoundary backBlazeBoundary;
    private ProductVariantMapper productVariantMapper;
    private ProductImageMapper productImageMapper;
    private StoreRepository storeRepository;

    @Override
    @Transactional
    public ProductOutputData save(ProductInputData productInputData, UserDetails userDetails) {
        AccountEntity performInsertingAccount = (AccountEntity) userDetails;
        List<ProductImageEntity> productImageEntities = getListImage(productInputData);
        List<ProductVariantEntity> productVariantEntities = getListVariant(productInputData,
                performInsertingAccount.getWorkingAt());
        ProductEntity needToCreateProduct = ProductEntity.builder()
                .createdAt(LocalDateTime.now())
                .createdBy(performInsertingAccount)
                .productDescription(productInputData.getProductDescription())
                .productName(productInputData.getProductName())
                .productImages(productImageEntities)
                .productVariants(productVariantEntities)
                .build();
        return null;
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

    private List<ProductImageEntity> getListImage(ProductInputData productInputData) {
        return backBlazeBoundary.store(productInputData.getProductImages())
                .stream()
                .map(imageUrl -> ProductImageEntity.builder()
                        .imageUrl(imageUrl)
                        .build())
                .toList();
    }

}
