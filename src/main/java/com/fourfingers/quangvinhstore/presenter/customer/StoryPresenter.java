package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Story;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.StoryOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StoryPresenter implements StoryOutputBoundary {
    @Override
    public ListStoryOutputData convertToListStoryOutputData(List<Story> stories) {
        return new ListStoryOutputData(stories);
    }

    @Override
    public StoryOutputData convertToStoryOutputData(Story story) {
        return new StoryOutputData(story);
    }
}
