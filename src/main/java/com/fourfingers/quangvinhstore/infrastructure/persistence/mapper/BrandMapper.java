package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Brand;
import com.fourfingers.quangvinhstore.infrastructure.schema.BrandEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandEntity toEntity(Brand brand);
    Brand toModel(BrandEntity brandEntity);
}
