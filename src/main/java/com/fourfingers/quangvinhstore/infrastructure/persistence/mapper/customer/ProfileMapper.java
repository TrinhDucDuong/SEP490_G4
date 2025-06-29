package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Profile;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toModel(ProfileEntity profileEntity);
    ProfileEntity toEntity(Profile profile);
}
