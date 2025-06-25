package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Blog;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    BlogEntity toEntity(Blog blog);
    Blog toModel(BlogEntity blog);
}
