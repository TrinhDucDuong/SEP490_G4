package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ColorOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListColorOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ColorPresenter implements ColorOutputBoundary {
    @Override
    public ListColorOutputData convertToListColorOutputData(List<String> colorHexes) {
        return new ListColorOutputData(colorHexes);
    }
}
