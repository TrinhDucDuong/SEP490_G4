package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Color;
import com.fourfingers.quangvinhstore.infrastructure.schema.ColorEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorStaffMapper {
    Color toModel(ColorEntity colorEntity);
    ColorEntity toEntity(Color color);
}
