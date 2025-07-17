package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Story;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.StoryOutputData;

import java.util.List;

public interface StoryOutputBoundary {
    ListStoryOutputData convertToListStoryOutputData(List<Story> stories);
    StoryOutputData convertToStoryOutputData(Story story);
}
