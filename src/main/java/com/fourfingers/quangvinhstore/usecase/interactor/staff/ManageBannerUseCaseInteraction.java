package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ImageStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BannerManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BannerManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BannerOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.UpdateBannerInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBannerUseCaseInteraction implements BannerManagementInputBoundary {
    private final BannerManagementOutputBoundary bannerManagementOutputBoundary;
    private final ImageRepository imageRepository;
    private final ImageStaffMapper imageMapper;
    private final AzureStorageBoundary azureStorageBoundary;

    @Override
    public BannerOutputData findAll() {
        return bannerManagementOutputBoundary.convertToBannerOutputData(
                imageRepository.findAllByImageType(ImageType.BANNER)
                        .stream()
                        .map(imageMapper::toModel)
                        .toList()
        );
    }

    @Override
    public BannerOutputData addBanners(List<MultipartFile> bannerImages) throws Exception {
        List<String> bannerUrl = uploadBannerImages(bannerImages);
        List<ImageEntity> imageEntities = bannerUrl.stream()
                .map(url -> {
                    return ImageEntity.builder()
                            .imageUrl(url)
                            .imageType(ImageType.BANNER)
                            .isActive(true)
                            .build();
                }).toList();
        return bannerManagementOutputBoundary.convertToBannerOutputData(
             imageRepository.saveAll(imageEntities).stream().map(imageMapper::toModel).toList()   
        );
    }

    @Override
    public BannerOutputData updateBannerDisplay(UpdateBannerInputData updateBannerInputData) {
        List<ImageEntity> needToDeActiveEntity = imageRepository.findAllById(updateBannerInputData.getDeActiveIds());
        needToDeActiveEntity.forEach(entity -> entity.setIsActive(false));
        imageRepository.saveAll(needToDeActiveEntity);

        List<ImageEntity> needToActiveEntity = imageRepository.findAllById(updateBannerInputData.getActiveIds());
        needToActiveEntity.forEach(entity -> entity.setIsActive(true));
        imageRepository.saveAll(needToActiveEntity);

        return bannerManagementOutputBoundary.convertToBannerOutputData(
                imageRepository.findAllByImageType(ImageType.BANNER).stream().map(imageMapper::toModel).toList()
        );
    }
    
    private List<String> uploadBannerImages(List<MultipartFile> bannerImages) throws Exception {
        return azureStorageBoundary.uploadMany(bannerImages);
    }
}
