package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Story;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoryOutputData;

import java.util.List;

public interface StoryManagementOutputBoundary {
    StoryOutputData convertToStoryOutputData(Story story);

    ListStoryOutputData convertToListStoryOutputData(List<Story> stories);
}
