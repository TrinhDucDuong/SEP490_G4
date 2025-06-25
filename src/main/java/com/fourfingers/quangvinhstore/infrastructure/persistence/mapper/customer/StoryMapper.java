package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Story;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoryMapper {
    StoryEntity toEntity(Story story);
    Story toStory(StoryEntity storyEntity);
}
