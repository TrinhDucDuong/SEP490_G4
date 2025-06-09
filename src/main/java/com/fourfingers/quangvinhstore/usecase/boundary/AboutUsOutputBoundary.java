package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Store;
import com.fourfingers.quangvinhstore.domain.model.Story;
import com.fourfingers.quangvinhstore.usecase.data.output.aboutus.AboutUsOutputData;

import java.util.List;

public interface AboutUsOutputBoundary {
    AboutUsOutputData convertToOutputData(List<Store> stores, List<Story> stories);
}
