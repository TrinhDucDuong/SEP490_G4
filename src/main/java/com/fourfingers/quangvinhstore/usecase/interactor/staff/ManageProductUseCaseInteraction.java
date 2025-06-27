package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.domain.model.staff.ProductVariant;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductVariantStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductUseCaseInteraction implements ProductManagementInputBoundary {
    private final ProductRepository productRepository;
    private final ProductStaffMapper productMapper;
    private final ProductVariantStaffMapper productVariantMapper;
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
        List<ProductVariantEntity> productVariantEntities = convertInputDataToListVariant(productInputData,
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
        return productManagementOutputBoundary.convertToProductOutputData(savedProduct);
    }

    @Override
    public ListProductOutputData findAllProducts(String name) {
        if (name == null || name.isBlank()) {
            return productManagementOutputBoundary.convertToListProductOutputData(
                    productRepository.findAll()
                            .stream()
                            .map(productEntity -> {
                                Product product = productMapper.toModel(productEntity);
                                product.setImages(getProductImages(productEntity));
                                product.setProductVariants(getProductVariants(productEntity));
                                return product;
                            })
                            .toList()
            );
        }
        return productManagementOutputBoundary.convertToListProductOutputData(
                productRepository.findByProductNameContainingIgnoreCase(name)
                        .stream().map(productMapper::toModel)
                        .toList()
        );
    }

    @Override
    @Transactional
    public ProductOutputData update(String id, ProductInputData productInputData, UserDetails userDetails) {
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
        productEntity.setUpdatedBy((AccountEntity) userDetails);
        productEntity.setProductVariants(updateProductVariants(productInputData, productEntity));

        ProductEntity savedProduct = productRepository.saveAndFlush(productEntity);
        Product product = productMapper.toModel(savedProduct);
        product.setImages(getProductImages(savedProduct));
        return productManagementOutputBoundary.convertToProductOutputData(product);
    }

    @Override
    public ProductOutputData delete(String id, UserDetails userDetails) throws Exception {
        Long productId = Long.parseLong(id);
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        productEntity.setUpdatedBy((AccountEntity) userDetails);
        productEntity.setUpdatedAt(LocalDateTime.now());
        productEntity.setIsActive(false);
        productRepository.saveAndFlush(productEntity);
        return productManagementOutputBoundary.convertToProductOutputData(
                productMapper.toModel(productEntity)
        );
    }

    @Override
    @Transactional
    public ProductOutputData getProduct(String id) {
        Long productId = Long.valueOf(id);
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(
                () -> new RuntimeException("Product not found")
        );
        Product product = productMapper.toModel(productEntity);
        product.setImages(getProductImages(productEntity));
        product.setProductVariants(getProductVariants(productEntity));
        return productManagementOutputBoundary.convertToProductOutputData(
                product
        );
    }

    private List<ProductVariantEntity> convertInputDataToListVariant(ProductInputData productInputData,
                                                                     StoreEntity storeEntity) {
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

    private List<ProductVariantEntity> updateProductVariants(ProductInputData productInputData,
                                                             ProductEntity productEntity) {
        return productInputData.getProductVariants().stream()
                .filter(inputVariant -> inputVariant.getProductVariantId() != null)
                .flatMap(inputVariant -> productEntity.getProductVariants().stream()
                        .filter(existingVariant -> inputVariant.getProductVariantId()
                                .equals(existingVariant.getProductVariantId()))
                        .peek(existingVariant -> {
//                            existingVariant.setColor(inputVariant.getColor());
                            existingVariant.setProductSize(ProductSize.valueOf(inputVariant.getProductSize()));
                        }))
                .collect(Collectors.toList());

    }

    private List<Image> getProductImages(ProductEntity productEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(productEntity.getProductId(), ImageType.PRODUCT)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }



    private List<ProductVariant> getProductVariants(ProductEntity productEntity) {
        return productEntity.getProductVariants().stream()
                .map(productVariantMapper::toModel)
                .toList();
    }
}
