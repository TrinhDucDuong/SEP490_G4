package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.customer.Color;
import com.fourfingers.quangvinhstore.infrastructure.schema.ColorEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    ColorEntity toColorEntity(Color color);
    Color toColor(ColorEntity colorEntity);
}

