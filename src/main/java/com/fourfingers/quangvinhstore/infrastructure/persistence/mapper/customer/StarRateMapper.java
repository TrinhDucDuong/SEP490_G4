package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.StarRate;
import com.fourfingers.quangvinhstore.infrastructure.schema.StarRateEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StarRateMapper {
    StarRate toModel(StarRateEntity starRateEntity);
    StarRateEntity toEntity(StarRate starRate);
}
