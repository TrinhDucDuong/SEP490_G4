package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Color;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListColorOutputData;

import java.util.List;

public interface ColorManagementOutputBoundary {
    ListColorOutputData convertToListColorOutputData(List<Color> colors);
}
