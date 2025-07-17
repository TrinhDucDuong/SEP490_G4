package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Story;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoryStaffMapper {
    Story toModel(StoryEntity storyEntity);
    StoryEntity toEntity(Story story);
}
