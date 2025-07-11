package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ColorStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ColorRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ColorManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ColorManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListColorOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageColorUseCaseInteraction implements ColorManagementInputBoundary {
    private final ColorRepository colorRepository;
    private final ColorStaffMapper colorStaffMapper;
    private final ColorManagementOutputBoundary colorManagementOutputBoundary;
    @Override
    public ListColorOutputData findAll() {
        return colorManagementOutputBoundary.convertToListColorOutputData(
                colorRepository.findAll()
                        .stream()
                        .map(colorStaffMapper::toModel)
                        .toList()
        );
    }
}
