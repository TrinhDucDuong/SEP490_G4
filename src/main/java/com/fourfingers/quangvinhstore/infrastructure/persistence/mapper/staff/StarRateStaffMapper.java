package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.StarRate;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StarRateStaffMapper {
    StarRate toModel(StarRateEntity starRateEntity);

    StarRateEntity toEntity(StarRate starRate);
}
