package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Brand;
import com.fourfingers.quangvinhstore.infrastructure.schema.BrandEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandStaffMapper {
    Brand toModel(BrandEntity brand);
    BrandEntity toEntity(Brand brand);
}
