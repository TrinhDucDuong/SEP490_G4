package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.adapter.exception.StoryNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.staff.Story;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.StoryStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoryRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoryManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStoryOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoryOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoryUseCaseInteraction implements StoryManagementInputBoundary {
    private final StoryRepository storyRepository;
    private final StoryManagementOutputBoundary storyManagementOutputBoundary;
    private final StoryStaffMapper storyStaffMapper;

    @Override
    public ListStoryOutputData getAllStory() {
        return storyManagementOutputBoundary.convertToListStoryOutputData(
                storyRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(storyStaffMapper::toModel)
                        .toList()
        );
    }

    @Override
    public StoryOutputData getStory(String id) {
        try {
            Long storyId = Long.parseLong(id);
            return storyManagementOutputBoundary.convertToStoryOutputData(
                    storyStaffMapper.toModel(
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
            Long storyId = Long.parseLong(id);
            StoryEntity storyEntity = storyRepository.findByStoryIdAndIsActiveTrue(storyId)
                    .orElseThrow(() -> new StoryNotFoundException("Story's not found"));
            storyEntity.setIsActive(false);
            Story deletedStory = storyStaffMapper.toModel(storyRepository.save(storyEntity));
            return storyManagementOutputBoundary.convertToStoryOutputData(deletedStory);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid story id");
        }
    }

    @Override
    public StoryOutputData saveStory(String id, StoryInputData inputData) {
        if (id != null) {
            try {
                Long storyId = Long.parseLong(id);
                StoryEntity storyEntity = storyRepository.findByStoryIdAndIsActiveTrue(storyId)
                        .orElseThrow(StoryNotFoundException::new);
                storyEntity.setTitle(inputData.getTitle());
                storyEntity.setContent(inputData.getContent());
                Story updatedStory = storyStaffMapper.toModel(storyRepository.save(storyEntity));
                return storyManagementOutputBoundary.convertToStoryOutputData(updatedStory);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid story id");
            }
        } else {
            StoryEntity storyEntity = StoryEntity.builder()
                    .title(inputData.getTitle())
                    .content(inputData.getContent())
                    .isActive(true)
                    .build();
            Story addedStory = storyStaffMapper.toModel(storyRepository.save(storyEntity));
            return storyManagementOutputBoundary.convertToStoryOutputData(addedStory);
        }
    }
}
