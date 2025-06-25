package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Brand;
import com.fourfingers.quangvinhstore.domain.model.customer.Image;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.BrandMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BrandRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.BrandEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BrandInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BrandOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.brand.ListBrandOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BrandUseCaseInteraction implements BrandInputBoundary {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;
    private final BrandOutputBoundary brandOutputBoundary;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;

    @Override
    public ListBrandOutputData getAll() {
        return brandOutputBoundary.convertToListBrandOutputData(
                brandRepository.findAll().stream()
                        .map(brandEntity -> {
                             Brand brand = brandMapper.toModel(brandEntity);
                             brand.setImages(getBrandImages(brandEntity));
                             return brand;
                        })
                        .toList()
        );
    }

    private List<Image> getBrandImages(BrandEntity brandEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(brandEntity.getBrandId(), ImageType.BRAND)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }
}
