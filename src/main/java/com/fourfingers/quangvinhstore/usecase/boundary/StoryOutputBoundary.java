package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Story;
import com.fourfingers.quangvinhstore.usecase.data.output.story.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.story.StoryOutputData;

import java.util.List;

public interface StoryOutputBoundary {
    ListStoryOutputData convertToListStoryOutputData(List<Story> stories);
    StoryOutputData convertToStoryOutputData(Story story);
}
