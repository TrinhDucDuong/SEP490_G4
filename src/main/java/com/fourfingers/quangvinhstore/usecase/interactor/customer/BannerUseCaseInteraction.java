package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.banner.BannerOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BannerUseCaseInteraction implements BannerInputBoundary {
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final BannerOutputBoundary bannerOutputBoundary;
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
