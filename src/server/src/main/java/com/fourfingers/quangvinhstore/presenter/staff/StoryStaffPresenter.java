package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Story;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoryManagementOutputBoundary;

import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoryOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StoryStaffPresenter implements StoryManagementOutputBoundary {
    @Override
    public StoryOutputData convertToStoryOutputData(Story story) {
        return new StoryOutputData(story);
    }

    @Override
    public ListStoryOutputData convertToListStoryOutputData(List<Story> stories) {
        return new ListStoryOutputData(stories);
    }
}
