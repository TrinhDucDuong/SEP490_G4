package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Authority;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthorityMapper {
    Authority toModel(AuthorityEntity authorityEntity);
    AuthorityEntity toEntity(Authority authority);
}
