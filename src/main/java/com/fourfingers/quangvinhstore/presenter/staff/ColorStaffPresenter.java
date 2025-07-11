package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Color;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ColorManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListColorOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ColorStaffPresenter implements ColorManagementOutputBoundary {
    @Override
    public ListColorOutputData convertToListColorOutputData(List<Color> colors) {
        return new ListColorOutputData(colors);
    }
}
