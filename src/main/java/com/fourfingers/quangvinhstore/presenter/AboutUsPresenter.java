package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.domain.model.Story;
import com.fourfingers.quangvinhstore.usecase.boundary.AboutUsOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.aboutus.AboutUsOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AboutUsPresenter implements AboutUsOutputBoundary {
    @Override
    public AboutUsOutputData convertToOutputData(List<Store> stores, List<Story> stories) {
        return new AboutUsOutputData(stores, stories);
    }
}
