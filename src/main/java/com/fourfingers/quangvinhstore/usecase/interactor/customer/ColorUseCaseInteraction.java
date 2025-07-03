package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.repository.ColorRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ColorEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ColorInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ColorOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListColorOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ColorUseCaseInteraction implements ColorInputBoundary {
    private final ColorOutputBoundary colorOutputBoundary;
    private final ColorRepository colorRepository;
    @Override
    public ListColorOutputData getAll() {
        List<String> colorHexes = colorRepository.findAll()
                .stream().map(ColorEntity::getColorHex)
                .toList();
        return colorOutputBoundary.convertToListColorOutputData(colorHexes);
    }
}
