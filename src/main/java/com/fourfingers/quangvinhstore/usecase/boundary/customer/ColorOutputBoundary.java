package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ListColorOutputData;

import java.util.List;

public interface ColorOutputBoundary {
    ListColorOutputData convertToListColorOutputData(List<String> colorHexes);
}
