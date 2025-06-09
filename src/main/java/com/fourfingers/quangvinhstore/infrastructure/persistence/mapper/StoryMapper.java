package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Story;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoryMapper {
    StoryEntity toEntity(Story story);
    Story toStory(StoryEntity storyEntity);
}
