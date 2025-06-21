package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.adapter.exception.StoryNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.Story;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.StoryMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.StoryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.story.StoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.story.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.story.StoryOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoryUseCaseInteraction implements StoryManagementInputBoundary {
    private final StoryRepository storyRepository;
    private final StoryOutputBoundary storyOutputBoundary;
    private final StoryMapper storyMapper;
    @Override
    public ListStoryOutputData getAllStory() {
        return storyOutputBoundary.convertToListStoryOutputData(
                List.of(storyRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(storyMapper::toStory)
                        .toArray(Story[]::new)
                )
        );
    }

    @Override
    public StoryOutputData getStory(String id) {
        try {
            UUID storyId = UUID.fromString(id);
            return storyOutputBoundary.convertToStoryOutputData(
                    storyMapper.toStory(
                            storyRepository.findById(storyId).orElseThrow(() -> new StoryNotFoundException("Story not found"))
                    )
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid story id");
        }
    }

    @Override
    public StoryOutputData deleteStory(String id) {
        try {
            UUID storyId = UUID.fromString(id);
            StoryEntity storyEntity = storyRepository.findByStoryIdAndIsActiveTrue(storyId)
                    .orElseThrow(() -> new StoryNotFoundException("Story's not found"));
            storyEntity.setIsActive(false);
            Story deletedStory = storyMapper.toStory(storyRepository.save(storyEntity));
            return storyOutputBoundary.convertToStoryOutputData(deletedStory);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid story id");
        }
    }

    @Override
    public StoryOutputData saveStory(String id, StoryInputData inputData) {
        if(id != null) {
            try {
                UUID storyId = UUID.fromString(id);
                StoryEntity storyEntity = storyRepository.findByStoryIdAndIsActiveTrue(storyId)
                        .orElseThrow(StoryNotFoundException::new);
                storyEntity.setTitle(inputData.getTitle());
                storyEntity.setContent(inputData.getContent());
                Story updatedStory = storyMapper.toStory(storyRepository.save(storyEntity));
                return storyOutputBoundary.convertToStoryOutputData(updatedStory);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid story id");
            }
        } else {
            StoryEntity storyEntity = StoryEntity.builder()
                    .title(inputData.getTitle())
                    .content(inputData.getContent())
                    .isActive(true)
                    .build();
            Story addedStory = storyMapper.toStory(storyRepository.save(storyEntity));
            return storyOutputBoundary.convertToStoryOutputData(addedStory);
        }
    }
}
