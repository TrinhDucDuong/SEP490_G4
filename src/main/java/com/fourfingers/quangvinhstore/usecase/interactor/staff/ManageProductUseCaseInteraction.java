package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.domain.model.staff.ProductVariant;
import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ColorStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductVariantStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.StoreStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.*;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ProductSize;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    private final ColorStaffMapper colorStaffMapper;
    private final ColorRepository colorRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StoreStaffMapper storeStaffMapper;

    @Override
    @Transactional
    public ProductOutputData create(ProductInputData productInputData, UserDetails userDetails) throws Exception {
        AccountEntity performInsertingAccount = (AccountEntity) userDetails;

        //Save product information
        ProductEntity needToCreateProduct = ProductEntity.builder()
                .unitPrice(BigDecimal.valueOf(Double.parseDouble(productInputData.getUnitPrice())))
                .createdAt(LocalDateTime.now())
                .createdBy(performInsertingAccount)
                .productDescription(productInputData.getProductDescription())
                .productName(productInputData.getProductName())
                .brand(getBrandEntity(productInputData.getBrandId()))
                .category(getCategoryEntity(productInputData.getCategoryId()))
                .isActive(true)
                .build();

        ProductEntity savedProductEntity = productRepository.saveAndFlush(needToCreateProduct);
        Product savedProduct = productMapper.toModel(savedProductEntity);

        //Save and return product variants
        savedProduct.setProductVariants(saveProductVariants(productInputData,
                savedProductEntity,
                performInsertingAccount.getWorkingAt())
        );

        //Save and return product images
        savedProduct.setImages(saveProductImages(productInputData.getProductImages(), savedProductEntity));

        return productManagementOutputBoundary.convertToProductOutputData(savedProduct);
    }

    @Override
    public ListProductOutputData findAllProducts(String name) {
        if (name == null || name.isBlank()) {
            return productManagementOutputBoundary.convertToListProductOutputData(
                    productRepository.findAll()
                            .stream()
                            .map(productEntity -> {
                                Product product = productMapper.toModelExcludeVariants(productEntity);
                                product.setImages(getProductImages(productEntity));
                                return product;
                            })
                            .toList()
            );
        }
        return productManagementOutputBoundary.convertToListProductOutputData(
                productRepository.findByProductNameContainingIgnoreCase(name)
                        .stream().map(productEntity -> {
                            Product product = productMapper.toModelExcludeVariants(productEntity);
                            product.setImages(getProductImages(productEntity));
                            return product;
                        })
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
        productEntity.setUpdatedBy((AccountEntity) userDetails);

        ProductEntity savedProduct = productRepository.saveAndFlush(productEntity);

        //Convert to model for returning
        Product product = productMapper.toModel(savedProduct);

        //Update and setNewImage
        List<MultipartFile> productImages = productInputData.getProductImages();

        boolean hasValidImages = productImages != null &&
                                 productImages.stream().anyMatch(file -> file != null && !file.isEmpty());

        if (hasValidImages) {
            deleteProductImages(productEntity); // xóa ảnh cũ
            product.setImages(saveProductImages(productImages, savedProduct)); // lưu ảnh mới
        } else {
            product.setImages(getProductImages(productEntity)); // giữ ảnh cũ
        }

        //Update and set new product variants
        product.setProductVariants(updateProductVariants(productInputData, savedProduct, (AccountEntity) userDetails));
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
        product.setProductVariants(getProductVariantsStore(productEntity.getProductVariants()));
        return productManagementOutputBoundary.convertToProductOutputData(
                product
        );
    }

    private List<ProductVariant> saveProductVariants(ProductInputData productInputData,
                                                     ProductEntity productEntity,
                                                     StoreEntity storeEntity) {
        List<ProductVariantEntity> needToSaveProductVariants = productInputData.getProductVariants()
                .stream()
                .map(productVariant -> {
                    //Check color exists, if not save a new color
                    if (checkIfColorNotExists(productVariant.getColor().getColorHex())) {
                        saveColor(productVariant.getColor().getColorHex());
                    }
                    ColorEntity colorEntity = colorStaffMapper.toEntity(
                            productVariant.getColor()
                    );
                    return ProductVariantEntity.builder()
                            .color(colorEntity)
                            .productSize(ProductSize.valueOf(productVariant.getProductSize()))
                            .product(productEntity)
                            .stores(List.of(storeEntity))
                            .quantity(productVariant.getQuantity())
                            .build();
                })
                .toList();
        List<ProductVariantEntity> savedProductVariants = productVariantRepository.saveAll(needToSaveProductVariants);
        return savedProductVariants.stream().map(productVariantMapper::toModel).toList();
    }

    private boolean checkIfColorNotExists(String colorHex) {
        return !colorRepository.existsByColorHex(colorHex);
    }

    private void saveColor(String colorHex) {
        colorRepository.save(ColorEntity.builder().colorHex(colorHex).build());
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

    private List<ProductVariant> updateProductVariants(ProductInputData productInputData,
                                                          ProductEntity productEntity,
                                                          AccountEntity performUpdatingAccount) {
        Map<Long, ProductVariantEntity> currentVariants = productEntity.getProductVariants().stream()
                .collect(Collectors.toMap(ProductVariantEntity::getProductVariantId, v -> v));

        //List to save new updated variants
        List<ProductVariantEntity> updatedList = new ArrayList<>();

        for(ProductVariant productVariant : productInputData.getProductVariants()) {
            if(checkIfColorNotExists(productVariant.getColor().getColorHex())) {
                saveColor(productVariant.getColor().getColorHex());
            }
            if(productVariant.getProductVariantId() != null) {
                ProductVariantEntity existingProductVariants = currentVariants.get(
                        productVariant.getProductVariantId()
                );
                ColorEntity colorEntity = colorStaffMapper.toEntity(
                        productVariant.getColor()
                );
                existingProductVariants.setColor(colorEntity);
                existingProductVariants.setProductSize(ProductSize.valueOf(productVariant.getProductSize()));
                existingProductVariants.setQuantity(productVariant.getQuantity());

                //Save the new product variants information into a list to update
                updatedList.add(existingProductVariants);

                //remove from map
                currentVariants.remove(existingProductVariants.getProductVariantId());
            } else {
                ProductVariantEntity newProductVariantEntity = ProductVariantEntity.builder()
                        .color(colorStaffMapper.toEntity(productVariant.getColor()))
                        .productSize(ProductSize.valueOf(productVariant.getProductSize()))
                        .product(productEntity)
                        .stores(List.of(performUpdatingAccount.getWorkingAt()))
                        .quantity(productVariant.getQuantity())
                        .build();
                updatedList.add(newProductVariantEntity);
            }

            List<ProductVariantEntity> needToDeleteVariants = currentVariants.values()
                    .stream()
                    .peek(productVariantEntity -> productVariantEntity.setIsActive(false))
                    .toList();
            productVariantRepository.saveAll(needToDeleteVariants);

            //Delete all variants that are no longer to save
            productVariantRepository.deleteAll(currentVariants.values());
        }
        //Update and return model
        List<ProductVariantEntity> savedProductVariants = productVariantRepository.saveAll(updatedList);
        return savedProductVariants.stream().map(productVariantMapper::toModel).toList();
    }

    private List<Image> getProductImages(ProductEntity productEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(productEntity.getProductId(), ImageType.PRODUCT)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }


    private List<ProductVariant> getProductVariantsStore(List<ProductVariantEntity> productVariantEntities) {
        return productVariantEntities.stream()
                .map(productVariantEntity -> {
                    ProductVariant productVariant = productVariantMapper.toModel(productVariantEntity);
                    List<Store> stores = productVariantEntity.getStores().stream().map(
                            storeStaffMapper::toModel
                    ).toList();
                    productVariant.setStores(stores);
                    return productVariant;
                })
                .toList();
    }

    private void deleteProductImages(ProductEntity productEntity) {
        List<ImageEntity> imageEntities = imageRepository.findAllByReferenceIdAndImageType(productEntity.getProductId(),
                ImageType.PRODUCT);
        List<String> imageUrls = imageEntities.stream().map(ImageEntity::getImageUrl).toList();
        azureStorageBoundary.deleteFile(imageUrls);
        imageRepository.deleteAll(imageEntities);
    }

//    private List<ProductVariant> getProductVariants(ProductEntity productEntity) {
//        return productEntity.getProductVariants().stream()
//                .map(productVariantMapper::toModel)
//                .toList();
//    }
}
