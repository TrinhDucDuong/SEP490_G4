package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ProductMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductWithVariantsOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductUseCaseInteraction implements ProductManagementInputBoundary {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductVariantMapper productVariantMapper;
    private final ProductOutputBoundary productOutputBoundary;
    private final AzureStorageBoundary azureStorageBoundary;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final BrandRepository brandEntityRepository;
    private final CategoryRepository categoryRepository;
    private final ProductManagementOutputBoundary productManagementOutputBoundary;

    @Override
    @Transactional
    public ProductOutputData create(ProductInputData productInputData, UserDetails userDetails) throws Exception {
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
                .brand(getBrandEntity(productInputData.getBrandId()))
                .category(getCategoryEntity(productInputData.getCategoryId()))
                .isActive(true)
                .build();
        ProductEntity savedProductEntity = productRepository.saveAndFlush(needToCreateProduct);
        List<Image> savedProductImage = saveProductImages(productInputData.getProductImages(), savedProductEntity);
        Product savedProduct = productMapper.toModel(savedProductEntity);
        savedProduct.setImages(savedProductImage);
        return productOutputBoundary.convertToProductOutputData(savedProduct);
    }

    @Override
    public ListProductOutputData findAllProductWithNameContains(String name) {
        return productOutputBoundary.convertToListProductOutputData(
            productRepository.findByProductNameContainingIgnoreCase(name)
                    .stream().map(productMapper::toModel)
                    .toList()
        );
    }

    @Override
    @Transactional
    public ProductOutputData update(String id, ProductInputData productInputData, UserDetails userDetails) throws Exception {
        Long productId = Long.valueOf(id);
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        productEntity.setUnitPrice(BigDecimal.valueOf(Double.parseDouble(productInputData.getUnitPrice())));
        productEntity.setProductDescription(productInputData.getProductDescription());
        productEntity.setProductName(productInputData.getProductName());
        productEntity.setBrand(getBrandEntity(productInputData.getBrandId()));
        productEntity.setCategory(getCategoryEntity(productInputData.getCategoryId()));
        productEntity.setUpdatedAt(LocalDateTime.now());
        return null;
    }

    @Override
    public ProductOutputData delete(String id, UserDetails userDetails) throws Exception {
        return null;
    }

    @Override
    @Transactional
    public ProductWithVariantsOutputData getProduct(String id) {
        Long productId = Long.valueOf(id);
        ProductEntity productEntity = productRepository.findByProductIdAndIsActiveTrue(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        List<ProductVariantEntity> productVariantEntities = productEntity.getProductVariants();
        return productManagementOutputBoundary.convertProductWithVariantsOutputData(
                productMapper.toModel(productEntity),
                productVariantEntities.stream().map(productVariantMapper::toModel).toList()
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

    private List<Image> saveProductImages(List<MultipartFile> images, ProductEntity productEntity) throws Exception {
        List<String> imageUrls = azureStorageBoundary.uploadMany(images);
        List<ImageEntity> imageEntities = imageUrls.stream()
                .map(imageUrl -> imageRepository.saveAndFlush(
                        ImageEntity.builder()
                                .imageType(ImageType.PRODUCT)
                                .referenceId(productEntity.getProductId())
                                .imageUrl(imageUrl)
                                .isActive(true)
                                .build()
                ))
                .toList();
        return imageEntities.stream().map(imageMapper::toModel).toList();
    }

    private BrandEntity getBrandEntity(String brandId) {
        return brandEntityRepository.findByBrandId(Long.valueOf(brandId)).orElseThrow(
                () -> new RuntimeException("Brand not found")
        );
    }

    private CategoryEntity getCategoryEntity(String categoryId) {
        return categoryRepository.findByCategoryIdAndIsActiveIsTrue(Long.valueOf(categoryId)).orElseThrow(
                () -> new RuntimeException("Category not found")
        );
    }
}
