package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Brand;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.BrandStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BrandRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.BrandEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BrandManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BrandManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBrandOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBrandUseCaseInteraction implements BrandManagementInputBoundary {
    private final BrandRepository brandRepository;
    private final BrandStaffMapper brandStaffMapper;
    private final BrandManagementOutputBoundary brandManagementOutputBoundary;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final AzureStorageBoundary azureStorageBoundary;
    private final AccountMapper accountMapper;

    @Override
    public ListBrandOutputData getAll() {
        return brandManagementOutputBoundary.convertToListBrandOutputData(
                brandRepository.findAll()
                        .stream()
                        .map(this::getBrandInformation)
                        .toList()
        );
    }

    @Override
    public BrandOutputData getBrand(String brandId) {
        Long brandIdLong = Long.parseLong(brandId);
        return brandManagementOutputBoundary.convertToBrandOutputData(
                brandRepository.findById(brandIdLong)
                        .map(this::getBrandInformation)
                        .orElseThrow(
                                () -> new RuntimeException("Brand with id " + brandId + " not found")
                        )
        );
    }

    @Override
    public BrandOutputData create(BrandInputData input, UserDetails userDetails) throws Exception {
        if (checkBrandExist(input.getBrandName())) {
            throw new RuntimeException("Brand with name " + input.getBrandName() + " already exist");
        }
        AccountEntity performingCreatingAccountEntity = (AccountEntity) userDetails;
        BrandEntity needToCreateBrand = BrandEntity.builder()
                .brandName(input.getBrandName())
                .brandDescription(input.getBrandDescription())
                .isActive(true)
                .createdBy(performingCreatingAccountEntity)
                .createdAt(LocalDateTime.now())
                .build();
        BrandEntity savedBrandEntity = brandRepository.save(needToCreateBrand);
        Brand savedBrand = brandStaffMapper.toModel(savedBrandEntity);
        savedBrand.setImages(saveBrandImages(input.getBrandImages(), savedBrandEntity));
        return brandManagementOutputBoundary.convertToBrandOutputData(savedBrand);
    }

    @Override
    public BrandOutputData save(String brandId, BrandInputData input, UserDetails userDetails) throws Exception {
        AccountEntity performingUpdatingAccountEntity = (AccountEntity) userDetails;
        BrandEntity brandEntity = brandRepository.findById(Long.valueOf(brandId)).orElseThrow(
                () -> new RuntimeException("Brand not found")
        );
        if (checkBrandExist(input.getBrandName()) && !brandEntity.getBrandName().equals(input.getBrandName())) {
            throw new RuntimeException("Brand with name " + input.getBrandName() + " already exist");
        }
        brandEntity.setBrandName(input.getBrandName());
        brandEntity.setBrandDescription(input.getBrandDescription());
        brandEntity.setUpdatedAt(LocalDateTime.now());
        brandEntity.setUpdatedBy(performingUpdatingAccountEntity);
        brandRepository.save(brandEntity);
        updateBrandImages(input.getBrandImages(), brandEntity);
        Brand savedBrand = getBrandInformation(brandEntity);
        return brandManagementOutputBoundary.convertToBrandOutputData(savedBrand);
    }

    private Brand getBrandInformation(BrandEntity brandEntity) {
        return Brand.builder()
                .brandName(brandEntity.getBrandName())
                .brandId(brandEntity.getBrandId())
                .brandDescription(brandEntity.getBrandDescription())
                .images(imageRepository.findAllByReferenceIdAndImageType(brandEntity.getBrandId(), ImageType.BRAND)
                        .stream()
                        .map(imageMapper::toModel)
                        .toList())
                .isActive(brandEntity.getIsActive())
                .createdAt(brandEntity.getCreatedAt())
                .createdBy(accountMapper.toAccount(brandEntity.getCreatedBy()))
                .updatedAt(brandEntity.getUpdatedAt())
                .updatedBy(accountMapper.toAccount(brandEntity.getUpdatedBy()))
                .build();
    }

    @Override
    public BrandOutputData delete(String brandId) {
        Long brandIdLong = Long.parseLong(brandId);
        BrandEntity needToDeleteBrand = brandRepository.findById(brandIdLong).orElseThrow(
                () -> new RuntimeException("Brand not found")
        );
        needToDeleteBrand.setIsActive(false);
        needToDeleteBrand.setUpdatedAt(LocalDateTime.now());
        AccountEntity performingUpdatingAccountEntity = (AccountEntity) needToDeleteBrand.getCreatedBy();
        needToDeleteBrand.setUpdatedBy(performingUpdatingAccountEntity);
        brandRepository.save(needToDeleteBrand);
        Brand deletedBrand = brandStaffMapper.toModel(needToDeleteBrand);
        return brandManagementOutputBoundary.convertToBrandOutputData(deletedBrand);
    }

    private List<Image> saveBrandImages(List<MultipartFile> files, BrandEntity brandEntity) throws Exception {
        List<String> imageUrls = azureStorageBoundary.uploadMany(files);
        List<ImageEntity> imageEntities = imageUrls.stream()
                .map(imageUrl -> ImageEntity.builder()
                        .referenceId(brandEntity.getBrandId())
                        .imageType(ImageType.BRAND)
                        .imageUrl(imageUrl)
                        .isActive(true)
                        .build())
                .toList();
        return imageRepository.saveAll(imageEntities).stream().map(imageMapper::toModel).toList();
    }

    private boolean checkBrandExist(String brandName) {
        return brandRepository.findByBrandName(brandName).isPresent();
    }

    private List<Image> updateBrandImages(List<MultipartFile> files, BrandEntity brandEntity) throws Exception {
        List<ImageEntity> oldImageEntities = imageRepository.findAllByReferenceIdAndImageType(brandEntity.getBrandId(),
                ImageType.BRAND);
        List<String> oldImageUrls = oldImageEntities.stream().map(ImageEntity::getImageUrl).toList();
        azureStorageBoundary.deleteFile(oldImageUrls);
        imageRepository.deleteAll(oldImageEntities);
        return saveBrandImages(files, brandEntity);
    }
}
