package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Blog;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BlogStaffMapper {
    Blog toModel(BlogEntity entity);
    BlogEntity toEntity(Blog model);
}
