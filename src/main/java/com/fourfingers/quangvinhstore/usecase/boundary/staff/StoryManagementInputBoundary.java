package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.input.story.StoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.store.StoreOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.story.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.story.StoryOutputData;
import lombok.*;

public interface StoryManagementInputBoundary {
    ListStoryOutputData getAllStory();
    StoryOutputData getStory(String id);
    StoryOutputData deleteStory(String id);
    StoryOutputData saveStory(String id, StoryInputData inputData);
}
