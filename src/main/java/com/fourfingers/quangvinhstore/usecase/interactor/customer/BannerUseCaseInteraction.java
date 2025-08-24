package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.BannerOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Banner use case implementation that handles banner-related operations
 * This class provides functionality for retrieving banner images from the system
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BannerUseCaseInteraction implements BannerInputBoundary {
    /**
     * Repository interface for image data persistence operations
     */
    private final ImageRepository imageRepository;

    /**
     * Mapper for converting between image entities and domain models
     */
    private final ImageMapper imageMapper;

    /**
     * Output boundary interface for banner data presentation
     */
    private final BannerOutputBoundary bannerOutputBoundary;
    /**
     * Retrieves all banner images from the system
     * Filters images by BANNER type and transforms them to the output format
     *
     * @return BannerOutputData containing all banner images
     * @author LongLTHE170099
     */
    @Override
    public BannerOutputData getAll() {
        return bannerOutputBoundary.convertToBannerOutputData(
            imageRepository.findAllByImageType(ImageType.BANNER)
                    .stream()
                    .map(imageMapper::toModel)
                    .toList()
        );
    }
}
