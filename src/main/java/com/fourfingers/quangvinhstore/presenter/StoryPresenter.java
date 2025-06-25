package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.customer.Story;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.story.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.story.StoryOutputData;
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
