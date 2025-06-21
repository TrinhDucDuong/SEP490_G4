package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.BrandMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BrandRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.BrandInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.BrandOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.brand.ListBrandOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewListBrandUseCaseInteraction implements BrandInputBoundary {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;
    private final BrandOutputBoundary brandOutputBoundary;

    @Override
    public ListBrandOutputData getAll() {
        return brandOutputBoundary.convertToListBrandOutputData(
                brandRepository.findAll().stream()
                        .map(brandMapper::toModel)
                        .toList()
        );
    }
}
