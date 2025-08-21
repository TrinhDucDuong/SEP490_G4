package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.StoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoryOutputData;
import lombok.*;

public interface StoryManagementInputBoundary {
    ListStoryOutputData getAllStory();
    StoryOutputData getStory(String id);
    StoryOutputData deleteStory(String id);
    StoryOutputData saveStory(String id, StoryInputData inputData) throws RuntimeException;
}
